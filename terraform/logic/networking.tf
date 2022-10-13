

# Configure the Microsoft Azure Provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.71.0"
    }
  }
}
provider "azurerm" {
 
  features {}
}

locals {
  location_formatted =replace(lower(var.location)," ","")
  naming_convention = "${var.environment}-${var.service}-${local.location_formatted}"
  #key_rsa  = file("C:\Users\Chris\.ssh\id_ed25519.pub")
  #machine_region = var.location_formatted == "East US" ? "Standard F2" : "Standard D1"
}
# Create a resource group
resource "azurerm_resource_group" "resource_group" {
  name     = "${local.naming_convention}-rg" 
  location = var.location
  
}

# Create a virtual network within the resource group
resource "azurerm_virtual_network" "vnet" {
  name                = "${local.naming_convention}-vnet"
  resource_group_name = azurerm_resource_group.resource_group.name
  location            = azurerm_resource_group.resource_group.location
  address_space       = ["10.0.0.0/16"]
}

#Create a subnet fronted within the virtual network 
resource "azurerm_subnet" "subnet_fronted" {
  name                 = "${local.naming_convention}-fronted-sn"
  resource_group_name  = azurerm_resource_group.resource_group.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]

  
}

#Create a subnet backend within the virtual network 
resource "azurerm_subnet" "subnet_backend" {
  name                 = "${local.naming_convention}-backend-sn"
  resource_group_name  = azurerm_resource_group.resource_group.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/24"]
}

# resource "azurerm_subnet" "subnet_vpn" {
#   name                 = "${local.naming_convention}-vpn_snet"
#   resource_group_name  = azurerm_resource_group.resource_group.name
#   virtual_network_name = azurerm_virtual_network.vnet.name
#   address_prefixes     = ["10.0.3.0/24"]
# }

/*


*/
# resource "azurerm_public_ip" "vpn_public_ip" {
#   name                = "${local.naming_convention}-vpn-public-ip"
#   resource_group_name = azurerm_resource_group.resource_group.name
#   location            = azurerm_resource_group.resource_group.location
#   allocation_method   = "Dynamic"
# }

# resource "azurerm_network_interface" "vpn_nic" {
#   name                = "${local.naming_convention}-vpn-nic"
#   location            = azurerm_resource_group.resource_group.location
#   resource_group_name = azurerm_resource_group.resource_group.name

#   ip_configuration {
#     name                          = "public"
#     subnet_id                     = azurerm_subnet.subnet_vpn.id
#     private_ip_address_allocation = "Dynamic"
#     public_ip_address_id          = azurerm_public_ip.vpn_public_ip.id
#   }
# }

# resource "azurerm_linux_virtual_machine" "vpn_vm" {
#   name                            = "${local.naming_convention}-vpn-vm"
#   resource_group_name             = azurerm_resource_group.resource_group.name
#   location                        = azurerm_resource_group.resource_group.location
#   size                            = "Standard_F2"
#   admin_username      = "adminuser"
#   admin_password = "#Tomate2022"
#   disable_password_authentication = false
#   network_interface_ids = [
#     azurerm_network_interface.vpn_nic.id,
#   ]


#   os_disk {
#     caching              = "ReadWrite"
#     storage_account_type = "Standard_LRS"
#   }

#   source_image_reference {
#     publisher = "Canonical"
#     offer     = "0001-com-ubuntu-server-focal"
#     sku       = "20_04-lts"
#     version   = "latest"
#   }
# }

## Security Group
# resource "azurerm_network_security_group" "netSecGru" {
#   name                = "acceptanceTestSecurityGroup1"
#   location            = azurerm_resource_group.resource_group.location
#   resource_group_name = azurerm_resource_group.resource_group.name

#   security_rule {
#     name                       = "test123"
#     priority                   = 100
#     direction                  = "Inbound"
#     access                     = "Allow"
#     protocol                   = "*"
#     source_port_range          = "*"
#     destination_port_ranges     = ["22","443","80","15206"]
#     source_address_prefix      = "*"
#     destination_address_prefix = "*"
#   }
  
# }

# resource "azurerm_network_interface_security_group_association" "secAsso" {
#   network_interface_id      = azurerm_network_interface.vpn_nic.id
#   network_security_group_id = azurerm_network_security_group.netSecGru.id
# }

/*
resource "azurerm_subnet" "subnet_bastion" {
  name                 = "AzureBastionSubnet"
  resource_group_name  = azurerm_resource_group.resource_group.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.3.0/26"]
}

resource "azurerm_public_ip" "bastion_public_ip" {
  name                = "${local.naming_convention}-bastion-public-ip"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  allocation_method   = "Static"
  sku = "Standard"
}

resource "azurerm_bastion_host" "bastion_host" {
  name                = "${local.naming_convention}-bastion-host"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name

  ip_configuration {
    name                 = "${local.naming_convention}-bastion-ip-config"
    subnet_id            = azurerm_subnet.subnet_bastion.id
    public_ip_address_id = azurerm_public_ip.bastion_public_ip.id
  }
}

# NSG / security rules for Azure Bastion Host to inbound and outbut traffic
resource "azurerm_network_security_group" "bastion_nsg" {
  name                = "${local.naming_convention}-bastion-nsg"
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
  security_rule {
    name                       = "AllowAllTraficVnetInBound"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }
  #Ingress traffic for control plane activity that is Gateway Manager to able to talk to the Azure Bastion Host
  security_rule {
    name                       = "AllowGatewayManagerInBound"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "GatewayManager"
    destination_address_prefix = "*"
  }
  #Ingress traffic for health probes that is Azure Load Balancer to able to talk to the Azure Bastion Host
  security_rule {
    name                       = "AllowAzureLoadBalancerInBound"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "AzureLoadBalancer"
    destination_address_prefix = "*"
  }

  #Out bound TRaffic

  #Egress traffic to the target VM subnets over ports 3389 and 22
  security_rule {
    name                       = "AllowTargetSubnetOutBound"
    priority                   = 100
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "VirtualNetwork"
  }
  #Egress traffic to AzureCloud over ports 443 
  security_rule {
    name                       = "AllowAzureCloudOutBound"
    priority                   = 105
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "AzureCloud"
  }
  #Egress traffic for data plane communication between Azure Bastion and VNets service tags
  security_rule {
    name                       = "AllowVnetServiceTagsOutBound"
    priority                   = 110
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "VirtualNetwork"
  }
  #Egress traffic for session Information
  security_rule {
    name                       = "AllowSessionInfoOutBound"
    priority                   = 120
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "Internet"
  }
}
resource "azurerm_subnet_network_security_group_association" "bastion_subnet_nsg_association" {
  subnet_id                 = azurerm_subnet.subnet_bastion.id
  network_security_group_id = azurerm_network_security_group.bastion_nsg.id
}
*/