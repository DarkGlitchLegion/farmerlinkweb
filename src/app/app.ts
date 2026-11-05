import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AdminApi, AdminUser } from './admin-api';
import { AnalyticsService } from './services/analytics_service';
import { AgricultureService } from './services/agriculture_service';
import { CategoryService } from './services/category_service';
import { CropAndPestReportService } from './services/crop_and_pest_report_service';
import { HarvestBatchService } from './services/harvest_batch_service';
import { MarketPriceService } from './services/market_price_service';
import { NotificationService } from './services/notification_service';
import { OrderItemService } from './services/order_item_service';
import { OrderService } from './services/order_service';
import { ProductService } from './services/product_service';
import { ProfileService } from './services/profile_service';

@Component({ selector: 'app-root', imports: [RouterOutlet], template: '<router-outlet />' })
export class App {}

@Component({
  standalone: true, imports: [CommonModule, FormsModule], selector: 'admin-login',
  template: `
    <main class="login-page">
      <section class="login-brand"><div class="brand-mark">🌱</div><span class="eyebrow">FARMERLINK DAVNOR</span><h1>Good food starts<br>with good connections.</h1><p>One place to support the people who grow, move, and share our food.</p><div class="login-art"><span>🌾</span><span>🥬</span><span>🍅</span><span>🌽</span></div></section>
      <section class="login-panel"><div class="login-card"><div class="mobile-brand"><span class="brand-mark">🌱</span><b>FarmerLink</b></div><span class="eyebrow">ADMIN PORTAL</span><h2>Welcome back</h2><p class="muted">Sign in with your administrator account to continue.</p>
        <form (ngSubmit)="signIn()"><label>Email address<input name="email" type="email" [(ngModel)]="email" autocomplete="username" placeholder="admin@example.com" required></label><label>Password<input name="password" type="password" [(ngModel)]="password" autocomplete="current-password" placeholder="Enter your password" required></label>
          @if (error()) { <div class="alert error">{{ error() }}</div> }
          <button type="submit" class="button primary full" [disabled]="busy()">{{ busy() ? 'Signing in…' : 'Sign in to admin' }} <span>→</span></button>
        </form><div class="secure-note"><span>●</span> Secure administrator access</div></div><small class="login-footer">FarmerLink · Supporting local agriculture</small></section>
    </main>`
})
export class LoginPage {
  private api = inject(AdminApi); private router = inject(Router); private route = inject(ActivatedRoute);
  email = ''; password = ''; busy = signal(false); error = signal('');
  async signIn() {
    this.error.set(''); this.busy.set(true);
    try {
      await this.api.login(this.email.trim(), this.password);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(returnUrl?.startsWith('/admin') ? returnUrl : '/admin');
    } catch (error) { this.error.set(error instanceof Error ? error.message : 'Unable to sign in.'); }
    finally { this.busy.set(false); }
  }
}

type Field = { key: string; label: string; type?: string; choices?: string[]; required?: boolean; multiline?: boolean };
type Module = { key: string; title: string; icon: string; fields: Field[]; create?: boolean; delete?: boolean };

const modules: Module[] = [
  { key:'users', title:'Users', icon:'♙', fields:[{key:'first_name',label:'First name',required:true},{key:'middle_name',label:'Middle name'},{key:'last_name',label:'Last name',required:true},{key:'email',label:'Email',type:'email',required:true},{key:'phone',label:'Phone',required:true},{key:'password',label:'Password',type:'password'},{key:'role',label:'Role',choices:['admin','farmer','buyer','business_buyer'],required:true},{key:'status',label:'Status',choices:['active','suspended','pending'],required:true}] },
  { key:'categories', title:'Categories', icon:'◈', fields:[{key:'name',label:'Name',required:true},{key:'description',label:'Description',multiline:true},{key:'image',label:'Image',type:'image'}] },
  { key:'products', title:'Products', icon:'▣', fields:[{key:'farmer_id',label:'Farmer account ID',type:'number',required:true},{key:'category_id',label:'Category ID',type:'number',required:true},{key:'name',label:'Name',required:true},{key:'description',label:'Description',multiline:true},{key:'variety',label:'Variety'},{key:'unit',label:'Unit',required:true},{key:'price_per_unit',label:'Price per unit',type:'number',required:true},{key:'available_quantity',label:'Available quantity',type:'number',required:true},{key:'minimum_order_quantity',label:'Minimum order quantity',type:'number',required:true},{key:'quality_grade',label:'Quality grade'},{key:'status',label:'Status',choices:['draft','active','sold_out','archived'],required:true}] },
  { key:'harvest-batches', title:'Harvest batches', icon:'♧', fields:[{key:'farmer_id',label:'Farmer account ID',type:'number',required:true},{key:'product_id',label:'Product ID',type:'number',required:true},{key:'harvest_date',label:'Harvest date',type:'datetime-local',required:true},{key:'available_date',label:'Available date',type:'datetime-local',required:true},{key:'quantity',label:'Quantity',type:'number',required:true},{key:'remaining_quantity',label:'Remaining quantity',type:'number',required:true},{key:'expected_expiration_date',label:'Expected expiration',type:'datetime-local',required:true},{key:'harvest_location',label:'Harvest location',required:true},{key:'status',label:'Status',choices:['upcoming','available','reserved','completed','expired'],required:true}] },
  { key:'farmer-profiles', title:'Farmer profiles', icon:'♧', fields:[{key:'user_id',label:'Farmer account ID',type:'number',required:true},{key:'farm_name',label:'Farm name',required:true},{key:'farm_address',label:'Farm address',required:true},{key:'municipality',label:'Municipality',required:true},{key:'province',label:'Province',required:true},{key:'farm_size',label:'Farm size',type:'number',required:true},{key:'farming_type',label:'Farming type',choices:['organic','conventional','mixed'],required:true},{key:'verification_status',label:'Verification',choices:['pending','approved','rejected'],required:true},{key:'latitude',label:'Latitude'},{key:'longitude',label:'Longitude'}] },
  { key:'business-buyer-profiles', title:'Business profiles', icon:'⌂', fields:[{key:'user_id',label:'Business buyer account ID',type:'number',required:true},{key:'business_name',label:'Business name',required:true},{key:'business_type',label:'Business type',choices:['restaurant','retailer','distributor'],required:true},{key:'business_address',label:'Business address',required:true},{key:'business_registration_number',label:'Registration number',required:true},{key:'contact_person',label:'Contact person',required:true},{key:'province',label:'Province',required:true},{key:'verification_status',label:'Verification',choices:['pending','approved','rejected'],required:true}] },
  { key:'market-prices', title:'Market prices', icon:'↗', fields:[{key:'product_id',label:'Product ID',type:'number',required:true},{key:'market_name',label:'Market name',required:true},{key:'municipality',label:'Municipality',required:true},{key:'price_min',label:'Minimum price',type:'number',required:true},{key:'price_max',label:'Maximum price',type:'number',required:true},{key:'average_price',label:'Average price',type:'number',required:true},{key:'unit',label:'Unit',required:true},{key:'recorded_date',label:'Recorded date',type:'datetime-local',required:true}] },
  { key:'advisories', title:'Advisories', icon:'✳', fields:[{key:'title',label:'Title',required:true},{key:'content',label:'Content',multiline:true,required:true},{key:'category',label:'Category',choices:['crop','livestock','pest_control','weather','pest','disease','planting','government_assistance'],required:true},{key:'municipality',label:'Municipality',required:true},{key:'severity',label:'Severity',choices:['low','medium','high'],required:true},{key:'published_at',label:'Published at',type:'datetime-local',required:true},{key:'expired_at',label:'Expires at',type:'datetime-local'},{key:'status',label:'Status',choices:['draft','published','archived'],required:true}] },
  { key:'crop-reports', title:'Crop reports', icon:'⚑', fields:[{key:'farmer_id',label:'Farmer account ID',type:'number',required:true},{key:'product_id',label:'Product ID',type:'number',required:true},{key:'report_type',label:'Report type',choices:['disease','pest','crop_damage','flooding'],required:true},{key:'description',label:'Description',multiline:true,required:true},{key:'image',label:'Image',type:'image'},{key:'latitude',label:'Latitude'},{key:'longitude',label:'Longitude'},{key:'severity',label:'Severity',choices:['low','medium','high','critical'],required:true},{key:'status',label:'Status',choices:['submitted','reviewing','resolved'],required:true}] },
  { key:'notifications', title:'Notifications', icon:'♧', fields:[{key:'user_id',label:'User account ID',type:'number',required:true},{key:'title',label:'Title',required:true},{key:'message',label:'Message',multiline:true,required:true},{key:'is_read',label:'Read status',choices:['unread','read'],required:true}] },
  { key:'orders', title:'Orders', icon:'▤', create:false, delete:false, fields:[{key:'status',label:'Status',choices:['pending','confirmed','processing','shipped','delivered','cancelled']},{key:'payment_status',label:'Payment status',choices:['unpaid','paid','refund']},{key:'fulfillment_status',label:'Fulfillment',choices:['pickup','farmer_arranged']},{key:'delivery_address',label:'Delivery address',multiline:true},{key:'notes',label:'Notes',multiline:true}] },
];

@Component({
  standalone: true, imports:[CommonModule, FormsModule, RouterLink], selector:'admin-page', styleUrl:'./app.css',
  template:`
  <div class="admin-layout">
    <aside class="sidebar" [class.open]="mobileMenu()"><a class="brand" routerLink="/admin"><span class="brand-mark">🌱</span><span>Farmer<span class="brand-light">Link</span><small>ADMIN CONSOLE</small></span></a>
      <div class="nav-label">WORKSPACE</div><a class="nav-item" routerLink="/admin" [class.active]="section()==='dashboard'"><span>▦</span>Dashboard</a>
      <div class="nav-label">MANAGEMENT</div>@for (item of modules; track item.key) { <a class="nav-item" [routerLink]="'/admin/'+item.key" [class.active]="section()===item.key"><span>{{item.icon}}</span>{{item.title}}</a> }
      <div class="sidebar-bottom"><a class="nav-item" routerLink="/admin/analytics" [class.active]="section()==='analytics'"><span>◷</span>Analytics</a><a class="nav-item" routerLink="/admin/profile" [class.active]="section()==='profile'"><span>♙</span>My profile</a><button class="nav-item signout" (click)="signOut()"><span>↪</span>Sign out</button><div class="user-chip"><div class="avatar">{{initials()}}</div><div><b>{{displayName()}}</b><small>Administrator</small></div><span class="online"></span></div></div>
    </aside>
    <main class="main-area"><header class="topbar"><button class="menu-toggle" (click)="mobileMenu.set(!mobileMenu())">☰</button><div class="breadcrumbs">FarmerLink <span>/</span> <b>{{pageTitle()}}</b></div><div class="top-actions"><span class="api-status"><i></i> Connected</span><a class="icon-button" routerLink="/admin/notifications" aria-label="Notifications">♧</a><a class="avatar top-avatar" routerLink="/admin/profile">{{initials()}}</a></div></header>
      <div class="page-content">
        @if (loading()) { <div class="loading"><span class="spinner"></span> Loading {{pageTitle().toLowerCase()}}…</div> }
        @if (error()) { <div class="alert error page-alert"><b>We couldn’t load this page</b><span>{{error()}}</span><button class="button secondary" (click)="loadPage()">Try again</button></div> }
        @if (!loading() && !error() && section()==='dashboard') { <section>
          <div class="welcome-row"><div><span class="eyebrow">{{greeting()}}</span><h1>Welcome back, {{firstName()}}</h1><p>Here’s what’s happening across your marketplace today.</p></div><span class="date-pill">◷ &nbsp;{{today}}</span></div>
          <div class="metric-grid">@for (metric of metrics(); track metric.label) { <article class="metric-card"><div class="metric-icon" [class]="metric.tone">{{metric.icon}}</div><div class="metric-value">{{metric.value}}</div><div class="metric-label">{{metric.label}}</div><small>{{metric.note}}</small></article> }</div>
          <div class="dashboard-grid"><section class="panel"><div class="panel-heading"><div><h2>Recent orders</h2><p>Latest marketplace activity</p></div><a routerLink="/admin/orders">View all →</a></div>@if (orders().length) { <div class="table-wrap"><table><thead><tr><th>ORDER</th><th>BUYER</th><th>DATE</th><th>STATUS</th><th></th></tr></thead><tbody>@for (row of orders(); track row.id) {<tr><td><b>#{{row.order_number || row.id}}</b></td><td>{{row.buyer_id}}</td><td>{{date(row.created_at)}}</td><td><span class="status-tag">{{row.status}}</span></td><td><a [routerLink]="'/admin/orders/'+row.id">↗</a></td></tr>}</tbody></table></div> } @else {<div class="empty-inline">No recent orders to show.</div>}</section>
          <section class="panel quick-panel"><div class="panel-heading"><div><h2>Quick access</h2><p>Jump into a workspace</p></div></div><div class="quick-links">@for (item of modules; track item.key) {<a [routerLink]="'/admin/'+item.key"><span>{{item.icon}}</span><b>{{item.title}}</b><i>→</i></a>}</div></section>
          <section class="panel"><div class="panel-heading"><div><h2>Profiles awaiting review</h2><p>Verification requests needing attention</p></div><a routerLink="/admin/farmer-profiles">Review profiles →</a></div>@if (pendingProfiles().length) {<div class="review-list">@for (item of pendingProfiles(); track item.id) {<a [routerLink]="'/admin/'+(item.kind==='business'?'business-buyer-profiles':'farmer-profiles')+'/'+item.id"><div class="review-icon">{{item.kind==='business'?'⌂':'♧'}}</div><div><b>{{item.name}}</b><small>{{item.kind==='business'?'Business profile':'Farmer profile'}} · {{date(item.created_at)}}</small></div><span class="pending-tag">Pending</span></a>}</div>} @else {<div class="empty-inline">All profile reviews are up to date.</div>}</section>
          <section class="panel"><div class="panel-heading"><div><h2>Latest crop reports</h2><p>Reports submitted by farmers</p></div><a routerLink="/admin/crop-reports">View reports →</a></div>@if (reports().length) {<div class="report-list">@for (row of reports(); track row.id) {<a [routerLink]="'/admin/crop-reports/'+row.id"><div class="report-symbol">⚑</div><div class="report-text"><b>{{row.report_type | titlecase}}</b><small>{{row.description}}</small></div><span class="status-tag">{{row.status}}</span></a>}</div>} @else {<div class="empty-inline">No crop reports to show.</div>}</section></div>
        </section> }
        @if (!loading() && !error() && section()==='analytics') {<section><div class="page-heading"><div><span class="eyebrow">OVERVIEW</span><h1>Analytics</h1><p>Marketplace performance at a glance.</p></div><button class="button secondary" (click)="loadPage()">↻ Refresh</button></div><div class="metric-grid">@for (metric of metrics(); track metric.label) {<article class="metric-card"><div class="metric-icon">{{metric.icon}}</div><div class="metric-value">{{metric.value}}</div><div class="metric-label">{{metric.label}}</div></article>}</div><div class="panel analytics-panel"><div class="panel-heading"><div><h2>Orders by status</h2><p>Current order distribution</p></div></div>@for (entry of analyticsEntries(); track entry[0]) {<div class="bar-row"><span>{{entry[0] | titlecase}}</span><div><i [style.width.%]="barWidth(entry[1])"></i></div><b>{{entry[1]}}</b></div>} @empty {<div class="empty-inline">No order status data available.</div>}</div></section> }
        @if (!loading() && !error() && module()) {<section>
          <div class="page-heading"><div><span class="eyebrow">MANAGEMENT</span><h1>{{module()!.title}}</h1><p>Review and manage {{module()!.title.toLowerCase()}} across FarmerLink.</p></div>@if (module()!.create && mode()==='list') {<button class="button primary" (click)="startCreate()">＋ Add {{singular()}}</button>}</div>
          @if (mode()==='list') {<section class="panel data-panel"><div class="list-toolbar"><label class="search-box"><span>⌕</span><input placeholder="Search {{module()!.title.toLowerCase()}}" [(ngModel)]="query" (ngModelChange)="filterRows()"></label><div class="toolbar-meta">{{filteredRows().length}} records on this page</div></div>
            @if (filteredRows().length) {<div class="table-wrap"><table><thead><tr>@for (column of columns(); track column) {<th>{{label(column)}}</th>}<th class="actions-col">ACTIONS</th></tr></thead><tbody>@for (row of filteredRows(); track row.id) {<tr>@for (column of columns(); track column) {<td>@if (column==='status'||column==='verification_status'||column==='is_read'||column==='severity') {<span class="status-tag">{{row[column] || '—'}}</span>} @else {<span>{{formatValue(row[column])}}</span>}</td>}<td class="row-actions"><button (click)="openDetail(row.id)" title="View">View</button><button (click)="startEdit(row)" title="Edit">Edit</button>@if (module()!.delete) {<button class="danger-text" (click)="remove(row)" title="Delete">Delete</button>}</td></tr>}</tbody></table></div>} @else {<div class="empty-state"><span>⌕</span><h3>{{query?'No matching records':'Nothing here yet'}}</h3><p>{{query?'Try a different search term.':'Records will appear here when available.'}}</p></div>}
            <div class="pagination"><span>Showing {{rows().length ? offset+1 : 0}}–{{offset+rows().length}} on this page</span><div><button class="button secondary small" [disabled]="offset===0" (click)="page(-1)">← Previous</button><button class="button secondary small" [disabled]="!hasNext" (click)="page(1)">Next →</button></div></div>
          </section> }
          @if (mode()==='detail' && selected()) {<section class="panel record-panel"><div class="panel-heading"><div><span class="eyebrow">RECORD #{{selected().id}}</span><h2>{{module()!.title}} details</h2></div><div class="button-row"><button class="button secondary" (click)="goList()">← Back</button><button class="button primary" (click)="startEdit(selected())">{{section()==='orders'?'Update order':'Edit record'}}</button></div></div><div class="details-grid">@for (entry of detailEntries(); track entry[0]) {<div class="detail-item"><small>{{label(entry[0])}}</small><b>{{formatValue(entry[1])}}</b></div>}</div>@if (section()==='orders') {<div class="order-items"><h3>Order items</h3>@if (orderItems().length) {@for (item of orderItems(); track item.id) {<div class="order-item"><b>Product {{item.product_id}} · Batch {{item.harvest_batch_id}}</b><span>{{item.quantity}} × ₱{{item.unit_price}}</span></div>}} @else {<p>No order items available.</p>}</div>}@if (module()!.delete) {<div class="record-danger"><button class="button danger" (click)="remove(selected())">Delete this record</button></div>}</section> }
          @if (mode()==='edit' || mode()==='create') {<form class="panel edit-panel" (ngSubmit)="save()"><div class="panel-heading"><div><span class="eyebrow">{{mode()==='create'?'NEW RECORD':'UPDATE RECORD'}}</span><h2>{{mode()==='create'?'Add':'Edit'}} {{singular()}}</h2></div><button type="button" class="button secondary" (click)="goList()">Cancel</button></div><div class="form-grid">@for (field of editableFields(); track field.key) {<label [class.wide-field]="field.multiline">{{field.label}} @if (field.choices) {<select [name]="field.key" [(ngModel)]="form[field.key]" [required]="required(field)"><option value="">Select {{field.label.toLowerCase()}}</option>@for (choice of field.choices; track choice) {<option [value]="choice">{{choice | titlecase}}</option>}</select>} @else if (field.multiline) {<textarea [name]="field.key" [(ngModel)]="form[field.key]" [required]="required(field)" rows="4"></textarea>} @else if (field.type==='image') {<input type="file" accept="image/*" (change)="setImage(field.key,$event)"><small class="field-help">Choose an image file to upload.</small>} @else {<input [name]="field.key" [type]="field.type || 'text'" [(ngModel)]="form[field.key]" [required]="required(field)" [step]="field.type==='number'?'any':null">}</label> }</div>@if (error()) {<div class="alert error">{{error()}}</div>}<div class="form-footer"><button class="button secondary" type="button" (click)="goList()">Cancel</button><button class="button primary" [disabled]="saving()">{{saving()?'Saving…':'Save changes'}}</button></div></form> }
        </section> }
        @if (!loading() && !error() && section()==='profile') {<section><div class="page-heading"><div><span class="eyebrow">ACCOUNT</span><h1>My profile</h1><p>Manage your administrator account details.</p></div></div><form class="panel edit-panel" (ngSubmit)="saveProfile()"><div class="form-grid">@for (field of profileFields; track field.key) {<label>{{field.label}} @if(field.type==='image') {<input type="file" accept="image/*" (change)="setProfileImage($event)"><small class="field-help">Choose an image file to upload.</small>} @else {<input [name]="field.key" [type]="field.type || 'text'" [(ngModel)]="profileForm[field.key]" [required]="field.key!=='password'">}</label>}</div>@if (error()) {<div class="alert error">{{error()}}</div>}@if (success()) {<div class="alert success">{{success()}}</div>}<div class="form-footer"><button class="button primary" [disabled]="saving()">{{saving()?'Saving…':'Save profile'}}</button></div></form></section> }
      </div></main>
  </div>`
})
export class AdminPage implements OnInit, OnDestroy {
  private api=inject(AdminApi); private router=inject(Router); private subscription?:Subscription;
  private analyticsApi=inject(AnalyticsService); private agricultureApi=inject(AgricultureService);
  private categoryApi=inject(CategoryService); private reportApi=inject(CropAndPestReportService);
  private harvestApi=inject(HarvestBatchService); private marketPriceApi=inject(MarketPriceService);
  private notificationApi=inject(NotificationService); private orderItemApi=inject(OrderItemService);
  private orderApi=inject(OrderService); private productApi=inject(ProductService); private profileApi=inject(ProfileService);
  readonly modules=modules; readonly today=new Intl.DateTimeFormat('en-PH',{weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(new Date());
  section=signal('dashboard'); mode=signal<'list'|'detail'|'edit'|'create'>('list'); loading=signal(true); saving=signal(false); error=signal(''); success=signal(''); mobileMenu=signal(false);
  rows=signal<any[]>([]); filteredRows=signal<any[]>([]); selected=signal<any>(null); orderItems=signal<any[]>([]); analytics=signal<any>({}); orders=signal<any[]>([]); reports=signal<any[]>([]); pendingProfiles=signal<any[]>([]); hasNext=false; offset=0; limit=25; query=''; form:Record<string,any>={}; profileForm:Record<string,any>={};
  profileFields:Field[]=[{key:'first_name',label:'First name',required:true},{key:'middle_name',label:'Middle name'},{key:'last_name',label:'Last name',required:true},{key:'email',label:'Email address',type:'email',required:true},{key:'phone',label:'Phone number',required:true},{key:'avatar',label:'Profile photo',type:'image'},{key:'password',label:'New password (leave blank to keep current)',type:'password'}];
  module=computed(()=>modules.find(m=>m.key===this.section()) ?? null);
  pageTitle=computed(()=>this.module()?.title ?? ({dashboard:'Dashboard',analytics:'Analytics',profile:'My profile'} as Record<string,string>)[this.section()] ?? 'Dashboard');
  metrics=computed(()=>{const a=this.analytics();return [
    {label:'Total users',value:this.num(a.users?.total),icon:'♙',tone:'green',note:`${this.num(a.users?.by_role?.farmer)} farmers`},
    {label:'Products listed',value:this.num(a.catalog?.products_total),icon:'▣',tone:'gold',note:'Marketplace catalog'},
    {label:'Total orders',value:this.num(a.orders?.total),icon:'▤',tone:'blue',note:`${this.num(a.orders?.open_orders)} open orders`},
    {label:'Pending reviews',value:this.num(a.profiles?.farmer_profiles_by_verification?.pending),icon:'◷',tone:'rose',note:'Farmer profiles'},
  ]});
  analyticsEntries=computed(()=>Object.entries(this.analytics().orders?.by_status ?? {}) as [string,number][]);
  sectionTitle='';
  async ngOnInit(){this.subscription=this.router.events.pipe(filter(e=>e instanceof NavigationEnd)).subscribe(()=>this.loadPage()); await this.loadPage();}
  ngOnDestroy(){this.subscription?.unsubscribe();}
  async loadPage(){
    this.loading.set(true);this.error.set('');this.success.set('');this.mobileMenu.set(false);
    const parts=this.router.url.split('?')[0].split('/').filter(Boolean);this.section.set(parts[1]??'dashboard');
    const module=this.module();this.mode.set(parts[2]==='new'?'create':parts[3]==='edit'?'edit':parts[2]&&parts[2]!=='new'?'detail':'list');
    try {
      if(this.section()==='dashboard'||this.section()==='analytics') await this.loadDashboard();
      else if(this.section()==='profile') this.profileForm=this.profilePayload(this.api.user()!);
      else if(module){
        if(this.mode()==='list') await this.loadRows();
        else if(this.mode()==='create') {if(!module.create)throw new Error(`${module.title} cannot be created.`);this.form={};}
        else {const id=Number(parts[2]); const row=this.mode()==='edit'&&history.state?.row?history.state.row:await this.getResource(module.key,id);this.selected.set(row);if(this.mode()==='edit')this.form=this.toForm(row,module.fields);if(module.key==='orders'&&this.mode()==='detail')this.orderItems.set(await this.orderItemApi.listForOrder(id,{offset:0,limit:100}));}
      } else if(['analytics','profile'].includes(this.section())) { /* built-in admin pages */ }
      else this.error.set('That admin page could not be found.');
    } catch(e){this.error.set(this.message(e));} finally {this.loading.set(false);}
  }
  async loadDashboard(){const results=await Promise.allSettled([this.analyticsApi.overview(),this.orderApi.list({offset:0,limit:5}),this.reportApi.list({offset:0,limit:5}),this.profileApi.listFarmerProfiles({offset:0,limit:100}),this.profileApi.listBusinessProfiles({offset:0,limit:100})]);
    if(results[0].status==='rejected')throw results[0].reason;this.analytics.set(results[0].value as any);
    this.orders.set(results[1].status==='fulfilled'?results[1].value as any[]:[]);this.reports.set(results[2].status==='fulfilled'?results[2].value as any[]:[]);
    const farmers=results[3].status==='fulfilled'?results[3].value as any[]:[];const businesses=results[4].status==='fulfilled'?results[4].value as any[]:[];
    this.pendingProfiles.set([...farmers.filter(x=>x.verification_status==='pending').map(x=>({...x,name:x.farm_name,kind:'farmer'})),...businesses.filter(x=>x.verification_status==='pending').map(x=>({...x,name:x.business_name,kind:'business'}))].slice(0,5));
  }
  async loadRows(){const data=await this.listResource(this.module()!.key,{offset:this.offset,limit:this.limit+1});this.hasNext=data.length>this.limit;const pageRows=data.slice(0,this.limit);this.rows.set(pageRows);this.filteredRows.set(pageRows);this.filterRows();}
  private listResource(key:string,query:{offset:number;limit:number}):Promise<any[]>{switch(key){
    case 'users':return this.profileApi.listUsers(query); case 'categories':return this.categoryApi.list(query);
    case 'products':return this.productApi.list(query); case 'harvest-batches':return this.harvestApi.list(query);
    case 'farmer-profiles':return this.profileApi.listFarmerProfiles(query); case 'business-buyer-profiles':return this.profileApi.listBusinessProfiles(query);
    case 'market-prices':return this.marketPriceApi.list(query); case 'advisories':return this.agricultureApi.list(query);
    case 'crop-reports':return this.reportApi.list(query); case 'notifications':return this.notificationApi.list(query);
    case 'orders':return this.orderApi.list(query); default:return Promise.reject(new Error('Unsupported admin resource.'));
  }}
  private getResource(key:string,id:number):Promise<any>{switch(key){
    case 'users':return this.profileApi.getUser(id); case 'categories':return this.categoryApi.get(id);
    case 'products':return this.productApi.get(id); case 'harvest-batches':return this.harvestApi.get(id);
    case 'farmer-profiles':return this.profileApi.getFarmerProfile(id); case 'business-buyer-profiles':return this.profileApi.getBusinessProfile(id);
    case 'market-prices':return this.marketPriceApi.get(id); case 'advisories':return this.agricultureApi.get(id);
    case 'crop-reports':return this.reportApi.get(id); case 'notifications':return this.notificationApi.get(id);
    case 'orders':return this.orderApi.get(id); default:return Promise.reject(new Error('Unsupported admin resource.'));
  }}
  private createResource(key:string,data:Record<string,any>):Promise<any>{switch(key){
    case 'users':return this.profileApi.createUser(data); case 'categories':return this.categoryApi.create(data);
    case 'products':return this.productApi.create(data); case 'harvest-batches':return this.harvestApi.create(data);
    case 'farmer-profiles':return this.profileApi.createFarmerProfile(data); case 'business-buyer-profiles':return this.profileApi.createBusinessProfile(data);
    case 'market-prices':return this.marketPriceApi.create(data); case 'advisories':return this.agricultureApi.create(data);
    case 'crop-reports':return this.reportApi.create(data); case 'notifications':return this.notificationApi.create(data);
    default:return Promise.reject(new Error('This resource cannot be created here.'));
  }}
  private updateResource(key:string,id:number,data:Record<string,any>):Promise<any>{switch(key){
    case 'users':return this.profileApi.updateUser(id,data); case 'categories':return this.categoryApi.update(id,data);
    case 'products':return this.productApi.update(id,data); case 'harvest-batches':return this.harvestApi.update(id,data);
    case 'farmer-profiles':return this.profileApi.updateFarmerProfile(id,data); case 'business-buyer-profiles':return this.profileApi.updateBusinessProfile(id,data);
    case 'market-prices':return this.marketPriceApi.update(id,data); case 'advisories':return this.agricultureApi.update(id,data);
    case 'crop-reports':return this.reportApi.update(id,data); case 'notifications':return this.notificationApi.update(id,data);
    case 'orders':return this.orderApi.update(id,data); default:return Promise.reject(new Error('Unsupported admin resource.'));
  }}
  private deleteResource(key:string,id:number):Promise<void>{switch(key){
    case 'users':return this.profileApi.removeUser(id); case 'categories':return this.categoryApi.remove(id);
    case 'products':return this.productApi.remove(id); case 'harvest-batches':return this.harvestApi.remove(id);
    case 'farmer-profiles':return this.profileApi.removeFarmerProfile(id); case 'business-buyer-profiles':return this.profileApi.removeBusinessProfile(id);
    case 'market-prices':return this.marketPriceApi.remove(id); case 'advisories':return this.agricultureApi.remove(id);
    case 'crop-reports':return this.reportApi.remove(id); case 'notifications':return this.notificationApi.remove(id);
    default:return Promise.reject(new Error('This resource cannot be deleted here.'));
  }}
  filterRows(){const q=this.query.toLowerCase().trim();this.filteredRows.set(!q?this.rows():this.rows().filter(row=>Object.values(row).some(v=>String(v??'').toLowerCase().includes(q))));}
  async page(direction:number){this.offset=Math.max(0,this.offset+direction*this.limit);this.loading.set(true);try{await this.loadRows();}catch(e){this.error.set(this.message(e));}finally{this.loading.set(false);}}
  columns(){return this.rows().length?Object.keys(this.rows()[0]).filter(k=>!['updated_at','image','avatar','description','content','notes','delivery_address','middle_name','latitude','longitude'].includes(k)).slice(0,6):[];}
  detailEntries(){return Object.entries(this.selected()??{}).filter(([k])=>!['avatar','image'].includes(k));}
  editableFields(){return this.module()!.fields.filter(f=>!(this.mode()==='create'&&this.module()!.key==='orders')&&!(this.module()!.key==='users'&&this.mode()==='edit'&&f.key==='password')&&!(this.module()!.key==='harvest-batches'&&f.key==='batch_code'));}
  required(field:Field){return !!field.required||(this.module()?.key==='users'&&this.mode()==='create'&&field.key==='password');}
  singular(){return this.module()?.title.replace(/s$/,'')??'record';}
  label(key:string){return key.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());}
  formatValue(value:any){if(value===null||value===undefined||value==='')return '—';if(typeof value==='object')return JSON.stringify(value);return String(value);}
  date(value:any){if(!value)return '—';const d=new Date(value);return Number.isNaN(d.valueOf())?'—':new Intl.DateTimeFormat('en-PH',{month:'short',day:'numeric',year:'numeric'}).format(d);}
  barWidth(value:number){const max=Math.max(1,...this.analyticsEntries().map(e=>Number(e[1])));return Number(value)/max*100;}
  num(value:any){return Number(value??0).toLocaleString('en-PH');}
  firstName(){return this.api.user()?.first_name||'Administrator';}
  displayName(){const u=this.api.user();return u?`${u.first_name} ${u.last_name}`:'Administrator';}
  initials(){const u=this.api.user();return `${u?.first_name?.[0]??'A'}${u?.last_name?.[0]??'D'}`.toUpperCase();}
  greeting(){const h=new Date().getHours();return `${h<12?'GOOD MORNING':h<18?'GOOD AFTERNOON':'GOOD EVENING'}, ADMINISTRATOR`;}
  startCreate(){this.form={};this.error.set('');this.mode.set('create');}
  startEdit(row:any){this.selected.set(row);this.form=this.toForm(row,this.module()!.fields);this.error.set('');this.mode.set('edit');}
  setImage(key:string,event:Event){const file=(event.target as HTMLInputElement).files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{this.form[key]=reader.result;};reader.onerror=()=>this.error.set('Could not read that image file.');reader.readAsDataURL(file);}
  setProfileImage(event:Event){const file=(event.target as HTMLInputElement).files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{this.profileForm['avatar']=reader.result;};reader.onerror=()=>this.error.set('Could not read that image file.');reader.readAsDataURL(file);}
  openDetail(id:number){this.router.navigate(['/admin',this.section(),id]);}
  goList(){this.router.navigate(['/admin',this.section()]);}
  pageList(){return this.router.navigate(['/admin',this.section()]);}
  toForm(row:any,fields:Field[]){const result:Record<string,any>={};for(const f of fields){let value=row[f.key]??'';if(f.type==='datetime-local'&&value)value=new Date(value).toISOString().slice(0,16);result[f.key]=value;}return result;}
  async save(){this.saving.set(true);this.error.set('');try{const module=this.module()!;const payload:Record<string,any>={};for(const field of this.editableFields()){const value=this.form[field.key];if(field.type==='image'&&this.mode()==='edit'&&value===this.selected()?.[field.key])continue;if(value!==''&&value!==undefined&&value!==null){payload[field.key]=field.type==='number'?Number(value):field.type==='datetime-local'?new Date(value).toISOString():value;}else if(this.mode()==='edit'&&value==='')payload[field.key]=null;}if(module.key==='users'&&this.mode()==='create'&&payload['middle_name']===undefined)payload['middle_name']='';
      if(module.key==='users'&&this.mode()==='edit'&&!payload['password'])delete payload['password'];
      const id=this.selected()?.id;if(this.mode()==='create')await this.createResource(module.key,payload);else await this.updateResource(module.key,id,payload);this.router.navigate(['/admin',module.key]);
    }catch(e){this.error.set(this.message(e));}finally{this.saving.set(false);}}
  async remove(row:any){if(!confirm(`Delete this ${this.singular().toLowerCase()}? This action cannot be undone.`))return;this.loading.set(true);try{await this.deleteResource(this.module()!.key,row.id);if(this.mode()==='detail')this.goList();else await this.loadRows();}catch(e){this.error.set(this.message(e));}finally{this.loading.set(false);}}
  async saveProfile(){this.saving.set(true);this.error.set('');this.success.set('');try{const payload={...this.profileForm};if(!payload['password'])delete payload['password'];if(payload['avatar']===this.api.user()?.avatar)delete payload['avatar'];const updated=await this.profileApi.updateUser(this.api.user()!.id,payload);this.api.user.set(updated);this.success.set('Your profile has been updated.');}catch(e){this.error.set(this.message(e));}finally{this.saving.set(false);}}
  profilePayload(user:AdminUser){return {first_name:user.first_name,middle_name:user.middle_name??'',last_name:user.last_name,email:user.email,phone:user.phone,avatar:user.avatar??null,password:''};}
  async signOut(){this.api.logout();await this.router.navigate(['/login']);}
  private message(e:unknown){return e instanceof Error?e.message:'Something went wrong. Please try again.';}
}
