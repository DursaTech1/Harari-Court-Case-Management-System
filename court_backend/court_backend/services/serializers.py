# serializers.py
from rest_framework import serializers
from .models import ServiceRequest, ServiceDocument

class ServiceDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceDocument
        fields = ['id', 'file', 'document_type', 'uploaded_at']
        read_only_fields = ['uploaded_at']

class ServiceRequestSerializer(serializers.ModelSerializer):
    documents = ServiceDocumentSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ServiceRequest
        fields = ['id', 'user', 'service_name', 'data', 'documents', 'created_at']
        read_only_fields = ['user', 'created_at']