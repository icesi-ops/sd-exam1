from rest_framework import serializers
from filesystem.models import File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model=File
        fields=('Id','Name','Path','Type')