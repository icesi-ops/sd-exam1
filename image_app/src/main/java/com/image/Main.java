package com.image;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Base64;
import java.util.Properties;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.consul.ConsulClient;
import io.vertx.ext.consul.ConsulClientOptions;
import io.vertx.ext.consul.ServiceOptions;
import io.vertx.ext.web.Router;
import io.vertx.core.http.HttpMethod;
import io.vertx.ext.web.handler.CorsHandler;
import jcifs.CIFSContext;
import jcifs.Configuration;
import jcifs.config.PropertyConfiguration;
import jcifs.context.BaseContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileOutputStream;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class Main {
  public static void main(String[] args) {
    
    Vertx vertx = Vertx.vertx();
    ConsulClient client = ConsulClient.create(vertx, new ConsulClientOptions().setHost("consul").setPort(8500));

    int appPort = Integer.parseInt(System.getenv("APP_PORT"));

    ServiceOptions opts = new ServiceOptions()
        .setId("abc123")
        .setName("imageapp")
        .setTags(Arrays.asList("EU-West", "EU-East"))
        .setPort(appPort);

    client.registerService(opts).onComplete(res -> {
      if (res.succeeded()) {
        System.out.println("Service successfully registered");
      } else {
        res.cause().printStackTrace();
      }

    });
    

    Router router = Router.router(vertx);
    Set<HttpMethod> allowedMethods = new HashSet<>();
    allowedMethods.add(HttpMethod.POST);

    Set<String> allowedHeaders = new HashSet<>();
    allowedHeaders.add("Content-Type");

    router.route().handler(CorsHandler.create()
        .addOrigin("*")
        .allowedMethods(allowedMethods)
        .allowedHeaders(allowedHeaders));
    router.route("/image").handler(routingContext -> {
      UUID uuid = UUID.randomUUID();
      HttpServerRequest request = routingContext.request();
      request.bodyHandler(body -> {
        try {
          JsonObject jsonBody = body.toJsonObject();
          String archivoBase64 = jsonBody.getString("imagenBase64");

          // Decodificar el contenido base64
          byte[] contenido = Base64.getDecoder().decode(archivoBase64);

          BaseContext baseCxt = null;
          Properties jcifsProperties = new Properties();
          jcifsProperties.setProperty("jcifs.smb.client.enableSMB2", "true");
          jcifsProperties.setProperty("jcifs.smb.client.dfs.disabled", "true");
          Configuration config = new PropertyConfiguration(jcifsProperties);
          baseCxt = new BaseContext(config);
          CIFSContext ct = baseCxt.withCredentials(new NtlmPasswordAuthenticator("admin", "password"));
          SmbFile sFile = new SmbFile("smb://samba:445/sambashare/imagen"+uuid.toString().substring(0, 5)+".png", ct);
          SmbFileOutputStream sfos = new SmbFileOutputStream(sFile);
          sfos.write(contenido);
          sfos.close();
          ct.close();

          routingContext.response().putHeader("content-type", "application/json")
              .end("{\"mensaje\": \"El archivo fue recibido y guardado correctamente.\"}");
        } catch (Exception e) {
          e.printStackTrace();
          routingContext.response().setStatusCode(500).putHeader("content-type", "application/json")
              .end("{\"error\": \"Hubo un error al procesar la solicitud.\"}");
        }
      });

    });

    router.route("/getimages").handler(routingContext -> {
      try {
    BaseContext baseCxt = null;
    Properties jcifsProperties = new Properties();
    jcifsProperties.setProperty("jcifs.smb.client.enableSMB2", "true");
    jcifsProperties.setProperty("jcifs.smb.client.dfs.disabled", "true");
    Configuration config = new PropertyConfiguration(jcifsProperties);
    baseCxt = new BaseContext(config);
    CIFSContext ct = baseCxt.withCredentials(new NtlmPasswordAuthenticator("admin", "password"));
    String path = "smb://samba:445/sambashare/"; // La ruta a tu carpeta compartida de Samba

    SmbFile dir = new SmbFile(path, ct);
    SmbFile[] files = dir.listFiles();

    JsonArray images = new JsonArray();
    for (SmbFile file : files) {
        if (file.getName().endsWith(".png")) {
            Path tempFile = Files.createTempFile(file.getName(), null);
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, tempFile, StandardCopyOption.REPLACE_EXISTING);
            }
            byte[] fileContent = Files.readAllBytes(tempFile);
            String encodedString = Base64.getEncoder().encodeToString(fileContent);
            images.add(encodedString);
        }
    }

    routingContext.response()
        .putHeader("content-type", "application/json")
        .end(images.encodePrettily());
    dir.close();
    ct.close();
  } catch (Exception e) {
    routingContext.fail(e);
  }


    });

    vertx.createHttpServer().requestHandler(router).listen(appPort);

  }
}