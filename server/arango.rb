require 'json'
require 'rest-client'

class ArangoDB
    def initialize()
        @collection_name = ENV['ARANGO_COLLECTION'] || "files"
        @host = ENV['ARANGO_URL'] || "http://localhost:8529"
        @cursorHost = @host + "/_api/cursor"
        @jwt = authenticate
        @headers = { 'Content-Type': 'application/json', 'Authorization': "Bearer #{@jwt}" }
        createCollection
    end
  
    private
  
    def authenticate
        auth_url = @host + "/_open/auth"

        headers = { 'Content-Type': 'application/json' }
      
        payload = {
            "username": ENV['ARANGO_USER'] || "root",
            "password": ENV['ARANGO_PASS'] || "root"
        }
    
        auth_response = RestClient.post(auth_url, payload.to_json, headers)
        response_body = JSON.parse(auth_response.body)
        response_body['jwt']
    end

    def createCollection
        collection_url = @host + "/_api/collection"

        collection_response = RestClient.get(collection_url, @headers)
        collection_list = JSON.parse(collection_response.body)['result']
        database_names = collection_list.map { |db| db['name'] }

        if database_names.include?(@collection_name)
            puts "La coleccion '#{@collection_name}' ya existe."
        else
            payload = {
                'name': @collection_name,
                'type': 2
            }
            create_response = RestClient.post(collection_url, payload.to_json, @headers)
            puts "La coleccion '#{@collection_name}' ha sido creada exitosamente." if create_response.code == 201
        end
    end

    public

    def insertDocument(name, type, size)
        payload = {
            "query": "INSERT { \"document\": { \"name\": @name, \"type\": @type, \"size\": @size }} INTO #{@collection_name} RETURN NEW._key",
            "bindVars": { 
                "name": name,
                "type": type,
                "size": size 
            }
        }

        get_response = RestClient.post(@cursorHost, payload.to_json, @headers)
        json = JSON.parse(get_response.body)
        json['result']
    end

    def get_filename(key)
        payload = {
            "query": "FOR doc IN #{@collection_name} FILTER doc._key == @key RETURN { \"data\": doc.document, \"key\": doc._key }",
            "bindVars": { "key": key.to_s}
        }
    
        get_response = RestClient.post(@cursorHost, payload.to_json, @headers)
        json = JSON.parse(get_response.body)
        
        result = json['result']
        
        if result.empty?
            raise StandardError, "Archivo no encontrado para la clave '#{key}'"
        end
        
        data = result[0]['data']
        name = data['name']
        type = data['type']
        "#{name + type}"
    end

    def getAllDocuments
        payload = {
            "query": "FOR doc IN #{@collection_name} RETURN { \"data\": doc.document, \"key\": doc._key }"
        }

        get_response = RestClient.post(@cursorHost, payload.to_json, @headers)
        json = JSON.parse(get_response.body)
        json['result']
    end

    def deleteDocument(key)
        payload = {
            "query": "REMOVE { _key: @key } IN #{@collection_name}",
            "bindVars": { "key": key.to_s }
        }

        RestClient.post(@cursorHost, payload.to_json, @headers)
    end

    def updateDocument(key, name, type, size)
        payload = {
            "query": "UPDATE { _key: @key } WITH { \"document\": { \"name\": @name, \"type\": @type, \"size\": @size } } IN #{@collection_name} RETURN NEW._key",
            "bindVars": { 
                "key": key.to_s,
                "name": name,
                "type": type,
                "size": size 
            }
        }

        get_response = RestClient.post(@cursorHost, payload.to_json, @headers)
        json = JSON.parse(get_response.body)
        json['result']
    end
end