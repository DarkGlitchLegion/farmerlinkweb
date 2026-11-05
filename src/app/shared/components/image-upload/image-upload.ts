import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector:'app-image-upload',standalone:true,
  template:`<div class="image-upload"><label class="upload-control"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" (change)="select($event)"><span class="preview">@if(value){<img [src]="value" alt="Selected image preview">}@else{<span>＋</span>}</span><span class="upload-copy"><b>{{value?'Replace image':'Choose an image'}}</b><small>PNG, JPG, WebP or GIF · up to 5 MiB</small></span></label>@if(error){<p class="upload-error" role="alert">{{error}}</p>}</div>`,
  styles:[`.upload-control{display:flex;align-items:center;gap:12px;padding:10px;border:1px dashed #cfd9cc;border-radius:10px;background:#fbfcfa;cursor:pointer}.upload-control input{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}.preview{display:grid;flex:none;place-items:center;width:56px;height:56px;overflow:hidden;border-radius:9px;background:#edf3e9;color:#59805c;font-size:20px}.preview img{width:100%;height:100%;object-fit:cover}.upload-copy{display:flex;flex-direction:column;gap:5px}.upload-copy b{color:#426347;font-size:11px}.upload-copy small{color:#929c92;font-size:9px}.upload-error{margin:6px 0 0;color:#aa5146;font-size:10px}`]
})
export class ImageUploadComponent {
  @Input() value:string|null=null;
  @Output() valueChange=new EventEmitter<string|null>();
  error='';
  select(event:Event){
    const input=event.target as HTMLInputElement;const file=input.files?.[0];this.error='';if(!file)return;
    const allowed=['image/png','image/jpeg','image/webp','image/gif'];
    if(!allowed.includes(file.type)){this.error='Choose a PNG, JPEG, WebP, or GIF image.';input.value='';return;}
    if(file.size>5*1024*1024){this.error='Image must be 5 MiB or smaller.';input.value='';return;}
    const reader=new FileReader();reader.onload=()=>this.valueChange.emit(String(reader.result));reader.onerror=()=>this.error='Could not read this image file.';reader.readAsDataURL(file);
  }
}
