using backend_library_app.Context;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;
using System.IO;
using Consul;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Configurar Firebase
FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile("./library-app-d3e16-firebase-adminsdk-a8fnv-a0fec7462e.json")
});

// Add services to the container.
//Variable to connection DB
var connectionString = builder.Configuration.GetConnectionString("Connection");
//Register services to Connection
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddCors(p => p.AddPolicy("corspolicy", build =>
{
    build.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
}));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Consul service registration
var consulAddress = "http://consul:8500"; // Reemplaza "consul_host" con la direcci�n de tu servidor Consul
var serviceId = "library-app-service";
var serviceName = "backend";
var serviceAddress = GetLocalIPAddress(); // Direcci�n en la que se ejecuta tu servicio
var servicePort = 5087; // Puerto en el que se ejecuta tu servicio

var consulClient = new ConsulClient(config => { config.Address = new Uri(consulAddress); });
var registration = new AgentServiceRegistration
{
    ID = serviceId,
    Name = serviceName,
    Address = serviceAddress,
    Port = servicePort,
    Checks = new[] {
        new AgentServiceCheck {
            HTTP = $"http://{serviceAddress}:{servicePort}/api/Health",
            Interval = TimeSpan.FromSeconds(10),
            Timeout = TimeSpan.FromSeconds(5)
        }
    }
};
await consulClient.Agent.ServiceRegister(registration);

string GetLocalIPAddress()
{
    var host = Dns.GetHostEntry(Dns.GetHostName());
    foreach (var ip in host.AddressList)
    {
        if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
        {
            return ip.ToString();
        }
    }
    throw new Exception("No se pudo encontrar la direcci�n IP local.");
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("corspolicy");
//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Register deregistration of the service when application is shutting down
app.Lifetime.ApplicationStopping.Register(() =>
{
    consulClient.Agent.ServiceDeregister(serviceId);
});


app.Run();
