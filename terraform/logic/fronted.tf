resource "azurerm_availability_set" "front_availability_set" {
  name                = "${local.naming_convention}-front-avs"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name

}
resource "azurerm_public_ip" "front_public_ip" {
  name                = "${local.naming_convention}-front-public-ip"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name 
  allocation_method = "Dynamic"

 
}

resource "azurerm_network_interface" "front_nic" {
  name                = "${local.naming_convention}-front-nic"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name 

  ip_configuration {
    name                          = "public"
    subnet_id                     = azurerm_subnet.subnet_fronted.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.front_public_ip.id
  }
}


resource "azurerm_linux_virtual_machine" "front_vm" {
  name                = "${local.naming_convention}-vm"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = azurerm_resource_group.resource_group.location
  size                = "Standard_F2"
  admin_username      = "adminuser"
  admin_password = "#Tomate2022"
  disable_password_authentication = false
  network_interface_ids = [
    azurerm_network_interface.front_nic.id,
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "16.04-LTS"
    version   = "latest"
  }
}

resource "azurerm_public_ip" "public_ip_front_lb" {
  name                = "${local.naming_convention}-lb-public-front-ip"
  domain_name_label = "lbipfront"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  allocation_method   = "Dynamic"
}

resource "azurerm_lb" "load_balancer_front" {
  name                = "${local.naming_convention}-lb-front"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name

  frontend_ip_configuration {
    name                 = "PublicIPFrontAddress"
    public_ip_address_id = azurerm_public_ip.public_ip_front_lb.id
  }
}

resource "azurerm_lb_backend_address_pool" "backend_pool_front_lb" {
  name                = "BackEndAddressPool"
  loadbalancer_id     = azurerm_lb.load_balancer_front.id
}

resource "azurerm_network_interface_backend_address_pool_association" "backend_ap_association_front" {
    network_interface_id      = azurerm_network_interface.front_nic.id
    ip_configuration_name     = "public"
    backend_address_pool_id   = azurerm_lb_backend_address_pool.backend_pool_front_lb.id 
}

resource "azurerm_network_security_group" "nsg_front" {
  name                = "myNetworkSecurityGroupFront"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name

  security_rule {
    name                       = "SSH"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}
resource "azurerm_network_interface_security_group_association" "nsg_association" {
  network_interface_id      = azurerm_network_interface.front_nic.id
  network_security_group_id = azurerm_network_security_group.nsg_front.id
}
