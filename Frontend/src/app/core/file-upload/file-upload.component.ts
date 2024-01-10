// file-upload.component.ts

import { Component } from "@angular/core";
import { FileUploadService } from "../../services/file-upload.service";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent {
  selectedFile: File | null = null;

  constructor(private fileUploadService: FileUploadService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      this.fileUploadService
        .uploadFile(this.selectedFile)
        .subscribe((response) => {
          console.log("File uploaded successfully:", response);
        });
    }
  }
}
