import {Component, ElementRef, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../services/user.service';
import {forkJoin} from 'rxjs';

export interface IMedia {
  pk?: number;
  file?: string;
  content_type?: string;
}

@Component({
  selector: 'app-mediainput',
  templateUrl: './mediainput.component.html',
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MediainputComponent),
      multi: true
    }
  ]
})
export class MediainputComponent implements OnInit, ControlValueAccessor {
  @Input()
  single = false;
  @Input()
  hasProfilePic = false;
  @Input()
  accept = 'image/jpeg';
  resourceUrl = '/api/media/';
  initializing = true;
  medias: IMedia[];
  uploader: FileUploader;
  url;
  onChange = (medias: number[]) => {
    // empty default
  };

  selectFile(event) {
    if(!event.target.files[0] || event.target.files[0].length == 0) {
      alert('Please select an image');
      return;
    }

    let mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      alert('Only images are allowed');
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

  constructor(private userService: UserService, private http: HttpClient, elm: ElementRef) {
  }

  ngOnInit(): void {
    this.hasProfilePic = false;
    this.uploader = new FileUploader({
      url: this.resourceUrl,
      authToken: 'Bearer ' + localStorage.getItem(this.userService.accessTokenLocalStorageKey),
      autoUpload: true,
    });
    this.uploader.onBeforeUploadItem = (item: FileItem) => {
        if (!this.medias) {
          this.medias = [];
        }
        this.medias.push({
          pk: null,
          file: item.file.name,
        });
    };
    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      const uploadedMedia = JSON.parse(response) as IMedia;
      const uploadingMedia = this.medias.find(media => !media.pk && uploadedMedia.file.endsWith(media.file));
      uploadingMedia.pk = uploadedMedia.pk;
      uploadingMedia.file = uploadedMedia.file;
    };
    this.hasProfilePic = true;
    this.uploader.onCompleteAll = () => {
      this.onChange(this.medias.map((m) => {
        return m.pk;
      }));
    };
  }



  deleteMedia(index: number): void {
    this.medias.splice(index, 1);
    this.hasProfilePic = false;
    this.onChange(this.medias.map((m) => {
      return m.pk;
    }));
  }

  downloadMedia(media: IMedia): void {
    this.http.get(`${this.resourceUrl}/download/${media.pk}/`, {responseType: 'blob'}).subscribe((blob: Blob) => {
      const fileURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = this.getFilename(media);
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
    });
  }

  getFilename(media: IMedia): string {
    return media.file.split('/').pop();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // not implemented
  }

  setDisabledState(isDisabled: boolean): void {
    // not implemented
  }

  writeValue(mediaPks: any): void {
    if (!mediaPks || !mediaPks.length) {
      this.initializing = false;
    }
    forkJoin(mediaPks.map((pk) => {
      return this.http.get(`${this.resourceUrl}/${pk}/`);
    })).subscribe((medias) => {
      this.medias = medias;
      this.initializing = false;
    });
  }
}
