<template>
  <div class="file">
    <form @submit.prevent="onSubmit" enctype="multipart/form-data">
      <div class="fields">
        <label>Upload file</label>
        <input type="file" ref="file" @change="onSelect" />
      </div>

      <div class="fields">
        <button>Submit</button>
      </div>
      <div class="message">
        <h5>{{ message }}</h5>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FileUpload",
  data() {
    return {
      file: "",
      message: "",
    };
  },
  methods: {
    onSelect() {
      this.file = this.$refs.file.files[0];
    },
    async toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    async onSubmit() {
      const encoded = await this.toBase64(this.file);
      console.log("Sending file");
      const request = {
        filename: this.file.name,
        data: encoded,
      };

      console.log(request);

      axios
        .post("http://localhost:5000/api/upload", request, {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        })
        .then((response) => {
          console.log("Response: ");
          console.log(response);
          if (response.status == 200) {
            this.message =
              "File uploaded successfully" + response.data.filepath;
          } else {
            this.message = "File upload failed";
          }
        })
        .catch((error) => {
          this.message = error.response.data.message;
        });
    },
  },
};
</script>
