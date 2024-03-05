require "#{Rails.root}/app/services/cyk_algorithm.rb"

class Api::V1::ResponsesController < ApplicationController
    before_action :parse_request, only: [:create]

    # GET /responses ------------- DEPRECATED -------------------
    # Due to postgress fre trial in heroku goes on so our app
    # crashed
    # def index 
    #    @responses = Response.all
    #    render json: @responses
    # end

    # POST /responses We are not saving any information in database 
    # in production enviroment due to what we already say in previous
    # method
    def create
        service = CykService.new(params[:grammar], params[:word])
        begin
            res = service.algorithm
            # @response = Response.new(word: params[:word],isAdmitted: res[0])
            #if @response.save
            render json: {response: res[0], matrix: res[1] }
        rescue => e
            puts(e)
            render error: {error: 'Unable to create the response.'}, status: 400
        end
    end

    private
    def parse_request
        @json = JSON.parse(request.body.read)
    end

end
