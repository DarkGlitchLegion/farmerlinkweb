import { Component, Input } from '@angular/core';

@Component({selector:'app-loading-spinner',standalone:true,template:`<div class="spinner-wrap" role="status"><span class="spinner"></span><span>{{label}}</span></div>`,styles:[`.spinner-wrap{display:flex;align-items:center;justify-content:center;gap:11px;min-height:160px;color:#829083;font-size:12px}.spinner{width:19px;height:19px;border:2px solid #dce7d9;border-top-color:#427b50;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}` ]})
export class LoadingSpinnerComponent {@Input() label='Loading…';}
