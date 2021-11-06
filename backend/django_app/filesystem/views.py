# Core imports
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.core.files.storage import default_storage

# Models
from filesystem.models import File

# Serializers
from filesystem.serializers import FileSerializer

# Create your views here.

@csrf_exempt
def fileApi(request, id=0):
    if request.method == 'GET':
        files= File.objects.all()
        files_srlz = FileSerializer(files, many=True)
        return JsonResponse(files_srlz.data, safe=False)
    
    elif request.method == 'POST':
        file = request.FILES['file']
        file_data = JSONParser().parse({})
        file_srlz = FileSerializer(data=file_data)
        if file_srlz.is_valid():
            file_srlz.save()

            return JsonResponse({"success": True, "message": "File added"}, safe=False)
        return JsonResponse({"success": False, "message": "Failed to save the file"}, safe=False)
        

