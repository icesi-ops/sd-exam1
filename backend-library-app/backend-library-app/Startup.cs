using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                builder =>
                {
                    builder.WithOrigins("http://localhost:5173") // Reemplaza con la URL de tu frontend
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
        });

        // Otros servicios...
    }

    public void Configure(IApplicationBuilder app)
    {
        // Otros middlewares...

        app.UseCors("AllowSpecificOrigin");

        // Otros middlewares...
    }
}
