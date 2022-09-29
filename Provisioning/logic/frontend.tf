resource "azurerm_availability_set" "front_availability_set" {
  name                = "${local.naming_convention}-front-avs"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
}

resource "azurerm_public_ip" "front_public_ip" {
  name                = "${local.naming_convention}-front-public-ip"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = azurerm_resource_group.resource_group.location
  allocation_method   = "Dynamic"
}

resource "azurerm_network_interface" "front_nic" {
  name                = "${local.naming_convention}-front-nic"
  location            = azurerm_resource_group.resource_groupLB.location
  resource_group_name = azurerm_resource_group.resource_groupLB.name

  ip_configuration {
    name                          = "public"
    subnet_id                     = azurerm_subnet.subnet_frontend.id
    private_ip_address_allocation = "Dynamic" 
    public_ip_address_id          = azurerm_public_ip.front_public_ip.id
  }
}

resource "azurerm_linux_virtual_machine" "front_vm" {
  name                = "${local.naming_convention}-front-vm"
  resource_group_name = azurerm_resource_group.resource_groupLB.name
  location            = azurerm_resource_group.resource_groupLB.location
  size                = "Standard_F2"
  admin_username      = "distribuidos"
  admin_password         = "AlejandraJhoanAndres212021"
  network_interface_ids = [
    azurerm_network_interface.front_nic.id,
  ]
  disable_password_authentication = false
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

resource "azurerm_public_ip" "public_ip_lb" {
  name                = "${local.naming_convention}-lb-public-ip"
  domain_name_label   = "lbipdavidfiat"
  resource_group_name = azurerm_resource_group.resource_groupLB.name
  location            = azurerm_resource_group.resource_groupLB.location
  allocation_method   = "Dynamic"
}

resource "azurerm_lb" "load_balancer" {
  name                = "${local.naming_convention}-lb"
  location            = azurerm_resource_group.resource_groupLB.location
  resource_group_name = azurerm_resource_group.resource_groupLB.name

  frontend_ip_configuration {
    name                 = "PublicIPAddress"
    public_ip_address_id = azurerm_public_ip.public_ip_lb.id
  }
}

resource "azurerm_lb_backend_address_pool" "backend_pool_lb"{
    loadbalancer_id = azurerm_lb.load_balancer.id
    name = "BackEndAddressPool"
}

resource "azurerm_network_interface_backend_address_pool_association" "backend_association" {
  network_interface_id    = azurerm_network_interface.front_nic.id
  ip_configuration_name   = "public"
  backend_address_pool_id = azurerm_lb_backend_address_pool.backend_pool_lb.id
}

resource "azurerm_network_security_group" "security-group" {
  name                = "${local.naming_convention}-sg"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name

  security_rule {
    name                       = "ssh"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "22"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_security_group" "security-group1" {
  name                = "${local.naming_convention}-sg1"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name

  security_rule {
    name                       = "ssh"
    priority                   = 100
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "22"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}