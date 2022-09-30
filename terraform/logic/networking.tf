

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
