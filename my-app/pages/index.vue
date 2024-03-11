<template>
  <div class="container">
    <h1 class="title">File Management</h1>
    <div class="upload-container">
      <input type="file" @change="handleFileUpload" />
      <button v-if="updating" @click="updateFile">Send update</button>
      <button v-else @click="createFile">Create</button>
      <button v-if="updating" @click="cancelUpdate">Cancel</button>
    </div>
    <table class="file-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Extension</th>
          <th>Size</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" :key="file.key">
          <td class="center-content">{{ file.data.name }}</td>
          <td class="center-content">{{ file.data.type }}</td>
          <td class="center-content">{{ file.data.size }}</td>
          <td>
            <button class="download-btn" @click="downloadFile(file.key)">Download</button>
            <button class="update-btn" @click="setUpdating(file.key)">Update</button>
            <button class="delete-btn" @click="deleteFile(file.key)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      selectedFile: null,
      updating: false,
      updatingKey: null,
      api_url: process.env.API_URL || 'http://localhost:8080'
    };
  },
  methods: {
    async fetchFiles() {
      try {
        const response = await fetch(`${this.api_url}/api/files`);
        const data = await response.json();
        this.files = data;
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    async createFile() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        try {
          const response = await fetch(`${this.api_url}/api/files`, {
            method: 'POST',
            body: formData
          });
          const data = await response.json();
          this.fetchFiles();
          this.selectedFile = null;
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    },
    async deleteFile(key) {
      try {
        const response = await fetch(`${this.api_url}/api/files/${key}`, {
          method: 'DELETE'
        });
        if (response.status === 204) {
          this.files = this.files.filter(file => file.key !== key);
        } else {
          console.error('Error deleting file:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    },
    async updateFile() {
      if (this.selectedFile && this.updatingKey) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        try {
          const response = await fetch(`${this.api_url}/api/files/${this.updatingKey}`, {
            method: 'PUT',
            body: formData
          });
          const data = await response.json();
          this.fetchFiles();
          this.selectedFile = null;
          this.updating = false;
          this.updatingKey = null;
        } catch (error) {
          console.error('Error updating file:', error);
        }
      }
    },
    cancelUpdate() {
      this.selectedFile = null;
      this.updating = false;
      this.updatingKey = null;
    },
    downloadFile(key) {
      window.open(`${this.api_url}/api/files/${key}`);
    },
    setUpdating(key) {
      this.updating = true;
      this.updatingKey = key;
    }
  },
  created() {
    this.fetchFiles();
  }
};
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
}

.upload-container {
  margin-bottom: 20px;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
}

.file-table th,
.file-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center; 
}

.file-table th {
  background-color: #f2f2f2;
}

.download-btn {
  background-color: #4caf50;
}

.update-btn,
.cancel-btn {
  background-color: #008CBA;
}

.delete-btn {
  background-color: #f44336;
}

.center-content {
  text-align: center;
}
</style>
