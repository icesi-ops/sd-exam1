resource "azurerm_lb" "load_balancer_back" {
  name                = "${local.naming_convention}-lb-back"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name

  frontend_ip_configuration {
    name                          = "PrivateIPAddress"
    subnet_id                     = "${azurerm_subnet.subnet_backend.id}"
    private_ip_address            = "${var.env=="Static"? var.private_ip: null}"
    private_ip_address_allocation = "${var.env=="Static"? "Static": "Dynamic"}"
    
  }
}

resource "azurerm_lb_backend_address_pool" "backend_pool_back_lb" {
  name                = "BackEndAddressPool"
  loadbalancer_id     = azurerm_lb.load_balancer_back.id
}


resource "azurerm_network_security_group" "nsg_back" {
  name                = "myNetworkSecurityGroupBack"
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


resource "azurerm_linux_virtual_machine_scale_set" "back_vmss" {
  name                = "${local.naming_convention}-back-vmss"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = azurerm_resource_group.resource_group.location
  sku                 = "Standard_F2"
  instances           = 1
  admin_username      = "adminuser"
  admin_password = "#Tomate2022"
  disable_password_authentication = false
    
    network_interface {
        name    = "${local.naming_convention}-back-nic"
        primary = true
        network_security_group_id = azurerm_network_security_group.nsg_back.id
        ip_configuration {
            name                          = "primary"
            subnet_id                     = azurerm_subnet.subnet_backend.id
            load_balancer_backend_address_pool_ids = [azurerm_lb_backend_address_pool.backend_pool_back_lb.id]
            
        }
    }
   

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "16.04-LTS"
    version   = "latest"
  }

  os_disk {
    storage_account_type = "Standard_LRS"
    caching              = "ReadWrite"
  }

}


