class EnableCors
    def initialize(app)
      @app = app
    end
  
    def call(env)
      status, headers, response = @app.call(env)
  
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'Content-Type'
  
      [status, headers, response]
    end
end
