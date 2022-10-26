/*

resource "azurerm_traffic_manager_profile" "traffic_manager" {
  name                   = "${local.naming_convention}-tf"
  resource_group_name    = azurerm_resource_group.resource_group.name
  traffic_routing_method = var.traffic_routing_method

  dns_config {
    relative_name = "tf-filesManagedAJA-lb"
    ttl           = 100
  }

  monitor_config {
    protocol                     = "HTTP"
    port                         = 80
    path                         = "/"
    interval_in_seconds          = 30
    timeout_in_seconds           = 9
    tolerated_number_of_failures = 3
  }
}

resource "azurerm_traffic_manager_endpoint" "endpoint" {
  name               = "${local.naming_convention}-endpoint-tf"
  weight             = 100
  type = "azureEndpoints"
  profile_name       = azurerm_traffic_manager_profile.traffic_manager.name
  resource_group_name = azurerm_resource_group.resource_group.name
  target_resource_id = "/subscriptions/5fe22fc3-9369-4249-9951-6513aea49b12/resourceGroups/${azurerm_resource_group.resource_group.name}/providers/Microsoft.Network/publicIPAddresses/${azurerm_public_ip.public_ip_lb.name}"
}

*/