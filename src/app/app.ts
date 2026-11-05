import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
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
import { StatCardComponent } from './shared/components/stat-card/stat-card';
import { StatusBadgeComponent } from './shared/components/status-badge/status-badge';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from './shared/components/empty-state/empty-state';
import { ImageUploadComponent } from './shared/components/image-upload/image-upload';
import { UserAvatarComponent } from './shared/components/user-avatar/user-avatar';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog';
import { CatalogGridComponent } from './features/catalog/catalog-grid';
import { CatalogOverviewComponent } from './features/catalog/catalog-overview';
import { DashboardPageComponent } from './features/dashboard/dashboard';
import { AnalyticsPageComponent } from './features/analytics/analytics';
import { AppIconComponent } from './shared/components/app-icon/app-icon';
import { PaginationComponent } from './shared/components/pagination/pagination';
import { ThemeService, ThemeMode } from './services/theme_service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {}

type Field = {
  key: string;
  label: string;
  type?: string;
  choices?: string[];
  required?: boolean;
  multiline?: boolean;
  lookup?: string;
  role?: string;
};

type Module = {
  key: string;
  title: string;
  iconName: string;
  fields: Field[];
  create?: boolean;
  delete?: boolean;
};

type NavigationGroup = { title: string; keys: string[] };

const navigationGroups: NavigationGroup[] = [
  { title: 'Management', keys: ['users', 'farmer-profiles', 'business-buyer-profiles'] },
  { title: 'Marketplace', keys: ['products', 'categories', 'harvest-batches', 'orders', 'catalog'] },
  { title: 'Agriculture', keys: ['market-prices', 'advisories', 'crop-reports'] },
  { title: 'Communication', keys: ['notifications'] },
];

const modules: Module[] = [
  {
    key: 'users',
    title: 'Users',
    iconName: 'users',
    fields: [
      { key: 'first_name', label: 'First name', required: true },
      { key: 'middle_name', label: 'Middle name' },
      { key: 'last_name', label: 'Last name', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Phone', required: true },
      { key: 'password', label: 'Password', type: 'password' },
      { key: 'role', label: 'Role', choices: ['admin', 'farmer', 'buyer', 'business_buyer'], required: true },
      { key: 'status', label: 'Status', choices: ['active', 'suspended', 'pending'], required: true },
    ],
  },
  {
    key: 'categories',
    title: 'Categories',
    iconName: 'categories',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'description', label: 'Description', multiline: true },
      { key: 'image', label: 'Image', type: 'image' },
    ],
  },
  {
    key: 'products',
    title: 'Products',
    iconName: 'products',
    fields: [
      { key: 'farmer_id', label: 'Farmer', lookup: 'users', role: 'farmer' },
      { key: 'category_id', label: 'Category', lookup: 'categories', required: true },
      { key: 'name', label: 'Name', required: true },
      { key: 'description', label: 'Description', multiline: true },
      { key: 'variety', label: 'Variety' },
      { key: 'unit', label: 'Unit', required: true },
      { key: 'price_per_unit', label: 'Price per unit', type: 'number', required: true },
      { key: 'available_quantity', label: 'Available quantity', type: 'number', required: true },
      { key: 'minimum_order_quantity', label: 'Minimum order quantity', type: 'number', required: true },
      { key: 'quality_grade', label: 'Quality grade' },
      { key: 'status', label: 'Status', choices: ['draft', 'active', 'sold_out', 'archived'], required: true },
    ],
  },
  {
    key: 'harvest-batches',
    title: 'Harvest batches',
    iconName: 'harvest-batches',
    fields: [
      { key: 'farmer_id', label: 'Farmer', lookup: 'users', role: 'farmer' },
      { key: 'product_id', label: 'Product', lookup: 'products', required: true },
      { key: 'harvest_date', label: 'Harvest date', type: 'datetime-local', required: true },
      { key: 'available_date', label: 'Available date', type: 'datetime-local', required: true },
      { key: 'quantity', label: 'Quantity', type: 'number', required: true },
      { key: 'remaining_quantity', label: 'Remaining quantity', type: 'number', required: true },
      { key: 'expected_expiration_date', label: 'Expected expiration', type: 'datetime-local', required: true },
      { key: 'harvest_location', label: 'Harvest location', required: true },
      { key: 'status', label: 'Status', choices: ['upcoming', 'available', 'reserved', 'completed', 'expired'], required: true },
    ],
  },
  {
    key: 'farmer-profiles',
    title: 'Farmer profiles',
    iconName: 'farmer-profiles',
    fields: [
      { key: 'user_id', label: 'Farmer account', lookup: 'users', role: 'farmer' },
      { key: 'farm_name', label: 'Farm name', required: true },
      { key: 'farm_address', label: 'Farm address', required: true },
      { key: 'municipality', label: 'Municipality', required: true },
      { key: 'province', label: 'Province', required: true },
      { key: 'farm_size', label: 'Farm size (ha)', type: 'number', required: true },
      { key: 'farming_type', label: 'Farming type', choices: ['organic', 'conventional', 'mixed'], required: true },
      { key: 'verification_status', label: 'Verification', choices: ['pending', 'approved', 'rejected'], required: true },
      { key: 'latitude', label: 'Latitude', type: 'number' },
      { key: 'longitude', label: 'Longitude', type: 'number' },
    ],
  },
  {
    key: 'business-buyer-profiles',
    title: 'Business profiles',
    iconName: 'business-buyer-profiles',
    fields: [
      { key: 'user_id', label: 'Business buyer account', lookup: 'users', role: 'business_buyer' },
      { key: 'business_name', label: 'Business name', required: true },
      { key: 'business_type', label: 'Business type', choices: ['restaurant', 'retailer', 'distributor'], required: true },
      { key: 'business_address', label: 'Business address', required: true },
      { key: 'business_registration_number', label: 'Registration number', required: true },
      { key: 'contact_person', label: 'Contact person', required: true },
      { key: 'province', label: 'Province', required: true },
      { key: 'verification_status', label: 'Verification', choices: ['pending', 'approved', 'rejected'], required: true },
    ],
  },
  {
    key: 'market-prices',
    title: 'Market prices',
    iconName: 'market-prices',
    fields: [
      { key: 'product_id', label: 'Product', lookup: 'products', required: true },
      { key: 'market_name', label: 'Market name', required: true },
      { key: 'municipality', label: 'Municipality', required: true },
      { key: 'price_min', label: 'Minimum price', type: 'number', required: true },
      { key: 'price_max', label: 'Maximum price', type: 'number', required: true },
      { key: 'average_price', label: 'Average price', type: 'number', required: true },
      { key: 'unit', label: 'Unit', required: true },
      { key: 'recorded_date', label: 'Recorded date', type: 'datetime-local', required: true },
    ],
  },
  {
    key: 'advisories',
    title: 'Advisories',
    iconName: 'advisories',
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'content', label: 'Content', multiline: true, required: true },
      {
        key: 'category',
        label: 'Category',
        choices: ['crop', 'livestock', 'pest_control', 'weather', 'pest', 'disease', 'planting', 'government_assistance'],
        required: true,
      },
      { key: 'municipality', label: 'Municipality', required: true },
      { key: 'severity', label: 'Severity', choices: ['low', 'medium', 'high'], required: true },
      { key: 'published_at', label: 'Published at', type: 'datetime-local', required: true },
      { key: 'expired_at', label: 'Expires at', type: 'datetime-local' },
      { key: 'status', label: 'Status', choices: ['draft', 'published', 'archived'], required: true },
    ],
  },
  {
    key: 'crop-reports',
    title: 'Crop reports',
    iconName: 'crop-reports',
    fields: [
      { key: 'farmer_id', label: 'Farmer', lookup: 'users', role: 'farmer', required: true },
      { key: 'product_id', label: 'Product', lookup: 'products', required: true },
      { key: 'report_type', label: 'Report type', choices: ['disease', 'pest', 'crop_damage', 'flooding'], required: true },
      { key: 'description', label: 'Description', multiline: true, required: true },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'latitude', label: 'Latitude', type: 'number' },
      { key: 'longitude', label: 'Longitude', type: 'number' },
      { key: 'severity', label: 'Severity', choices: ['low', 'medium', 'high', 'critical'], required: true },
      { key: 'status', label: 'Status', choices: ['submitted', 'reviewing', 'resolved'], required: true },
    ],
  },
  {
    key: 'notifications',
    title: 'Notifications',
    iconName: 'notifications',
    fields: [
      { key: 'user_id', label: 'Recipient', lookup: 'users', required: true },
      { key: 'title', label: 'Title', required: true },
      { key: 'message', label: 'Message', multiline: true, required: true },
      { key: 'is_read', label: 'Read status', choices: ['unread', 'read'], required: true },
    ],
  },
  { key: 'catalog', title: 'Catalog overview', iconName: 'catalog', create: false, delete: false, fields: [] },
  {
    key: 'orders',
    title: 'Orders',
    iconName: 'orders',
    create: false,
    delete: false,
    fields: [
      { key: 'status', label: 'Status', choices: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] },
      { key: 'payment_status', label: 'Payment status', choices: ['unpaid', 'paid', 'refund'] },
      { key: 'fulfillment_status', label: 'Fulfillment', choices: ['pickup', 'farmer_arranged'] },
      { key: 'delivery_address', label: 'Delivery address', multiline: true },
      { key: 'notes', label: 'Notes', multiline: true },
    ],
  },
];

for (const module of modules) {
  module.create ??= true;
  module.delete ??= true;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    StatCardComponent,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ImageUploadComponent,
    UserAvatarComponent,
    ConfirmDialogComponent,
    CatalogGridComponent,
    CatalogOverviewComponent,
    DashboardPageComponent,
    AnalyticsPageComponent,
    AppIconComponent,
    PaginationComponent,
  ],
  selector: 'admin-page',
  styleUrl: './app.css',
  templateUrl: './app.html',
  encapsulation: ViewEncapsulation.None,
})
export class AdminPage implements OnInit, OnDestroy {
  readonly api = inject(AdminApi);
  readonly themeService = inject(ThemeService);
  private router = inject(Router);
  private subscription?: Subscription;
  private analyticsApi = inject(AnalyticsService);
  private agricultureApi = inject(AgricultureService);
  private categoryApi = inject(CategoryService);
  private reportApi = inject(CropAndPestReportService);
  private harvestApi = inject(HarvestBatchService);
  private marketPriceApi = inject(MarketPriceService);
  private notificationApi = inject(NotificationService);
  private orderItemApi = inject(OrderItemService);
  private orderApi = inject(OrderService);
  private productApi = inject(ProductService);
  private profileApi = inject(ProfileService);

  readonly modules = modules;
  readonly today = new Intl.DateTimeFormat('en-PH', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
  readonly navigationGroups = navigationGroups;

  section = signal('dashboard');
  mode = signal<'list' | 'detail' | 'edit' | 'create'>('list');
  loading = signal(true);
  saving = signal(false);
  error = signal('');
  pageError = signal('');
  success = signal('');
  mobileMenu = signal(false);
  sidebarCollapsed = signal(false);
  searchOpen = signal(false);
  searchTerm = '';
  catalogView: 'grid' | 'table' = 'grid';
  availabilityFilter = 'all';
  themeMenu = signal(false);
  profileMenu = signal(false);
  notificationMenu = signal(false);
  headerNotifications = signal<any[]>([]);
  toast = signal('');
  deleteCandidate = signal<any>(null);
  deleteBusy = signal(false);
  userRoleFilter = 'all';
  recordStatusFilter = 'all';
  paymentStatusFilter = '';
  lookupFilters: Record<string, string> = {};

  rows = signal<any[]>([]);
  filteredRows = signal<any[]>([]);
  selected = signal<any>(null);
  orderItems = signal<any[]>([]);
  analytics = signal<any>({});
  orders = signal<any[]>([]);
  reports = signal<any[]>([]);
  recentUsers = signal<any[]>([]);
  pendingProfiles = signal<any[]>([]);
  catalogProducts = signal<any[]>([]);
  catalogCategories = signal<any[]>([]);
  catalogBatches = signal<any[]>([]);
  hasNext = false;
  offset = 0;
  limit = 25;
  query = '';
  form: Record<string, any> = {};
  profileForm: Record<string, any> = {};
  lookupRows: Record<string, any[]> = {};

  profileFields: Field[] = [
    { key: 'first_name', label: 'First name', required: true },
    { key: 'middle_name', label: 'Middle name' },
    { key: 'last_name', label: 'Last name', required: true },
    { key: 'email', label: 'Email address', type: 'email', required: true },
    { key: 'phone', label: 'Phone number', required: true },
    { key: 'avatar', label: 'Profile photo', type: 'image' },
    { key: 'password', label: 'New password (leave blank to keep current)', type: 'password' },
  ];

  module = computed(() => modules.find((m) => m.key === this.section()) ?? null);

  pageTitle = computed(() => {
    return (
      this.module()?.title ??
      ({
        dashboard: 'Dashboard',
        analytics: 'Analytics',
        profile: 'My Profile',
        settings: 'Settings',
      } as Record<string, string>)[this.section()] ??
      'Overview'
    );
  });

  metrics = computed(() => {
    const a = this.analytics();
    return [
      {
        label: 'Total users',
        value: this.num(a.users?.total),
        icon: 'users',
        tone: 'green',
        context: `${this.num(a.users?.by_role?.farmer)} farmers`,
      },
      {
        label: 'Farmers',
        value: this.num(a.users?.by_role?.farmer),
        icon: 'farmer-profiles',
        tone: 'green',
        context: 'Registered accounts',
      },
      {
        label: 'Individual buyers',
        value: this.num(a.users?.by_role?.buyer),
        icon: 'users',
        tone: 'blue',
        context: 'Registered accounts',
      },
      {
        label: 'Business buyers',
        value: this.num(a.users?.by_role?.business_buyer),
        icon: 'business-buyer-profiles',
        tone: 'gold',
        context: 'Registered accounts',
      },
      {
        label: 'Products',
        value: this.num(a.catalog?.products_total),
        icon: 'products',
        tone: 'gold',
        context: `${this.num(a.catalog?.active_products)} active listings`,
      },
      {
        label: 'Active inventory',
        value: this.num(a.catalog?.active_product_quantity),
        icon: 'harvest-batches',
        tone: 'green',
        context: 'Available produce units',
      },
      {
        label: 'Total orders',
        value: this.num(a.orders?.total),
        icon: 'orders',
        tone: 'blue',
        context: 'Marketplace orders',
      },
      {
        label: 'Pending orders',
        value: this.num(a.orders?.by_status?.pending),
        icon: 'orders',
        tone: 'rose',
        context: 'Awaiting confirmation',
      },
      {
        label: 'Pending verifications',
        value: this.num(
          (a.profiles?.farmer_profiles_by_verification?.pending ?? 0) +
            (a.profiles?.business_buyer_profiles_by_verification?.pending ?? 0)
        ),
        icon: 'check-circle',
        tone: 'rose',
        context: 'Farmer & business',
      },
      {
        label: 'Reports to review',
        value: this.num(
          (a.crop_reports?.by_status?.submitted ?? 0) + (a.crop_reports?.by_status?.reviewing ?? 0)
        ),
        icon: 'crop-reports',
        tone: 'rose',
        context: 'Submitted incidents',
      },
    ];
  });

  analyticsEntries = computed(
    () => Object.entries(this.analytics().orders?.by_status ?? {}) as [string, number][]
  );

  managementStats = computed(() => {
    const a = this.analytics();
    if (this.section() === 'users') {
      return [
        { label: 'Total users', value: this.num(a.users?.total) },
        { label: 'Farmers', value: this.num(a.users?.by_role?.farmer) },
        { label: 'Buyers', value: this.num(a.users?.by_role?.buyer) },
        { label: 'Business buyers', value: this.num(a.users?.by_role?.business_buyer) },
      ];
    }
    const statuses =
      this.section() === 'farmer-profiles'
        ? a.profiles?.farmer_profiles_by_verification
        : a.profiles?.business_buyer_profiles_by_verification;
    if (statuses) {
      return [
        {
          label: this.section() === 'farmer-profiles' ? 'Farmer profiles' : 'Business buyers',
          value: this.num(
            Object.values(statuses as Record<string, number>).reduce(
              (sum, value) => sum + Number(value || 0),
              0
            )
          ),
        },
        { label: 'Verified', value: this.num((statuses as any).approved) },
        { label: 'Pending verification', value: this.num((statuses as any).pending) },
        { label: 'Rejected', value: this.num((statuses as any).rejected) },
      ];
    }
    return [];
  });

  searchResults = computed(() => {
    const q = this.searchTerm.trim().toLowerCase();
    return q
      ? modules.filter((x) => x.title.toLowerCase().includes(q) || x.key.includes(q)).slice(0, 6)
      : [];
  });

  unreadNotifications = computed(() => this.headerNotifications().some((x) => x.is_read === 'unread'));

  navigationItems(group: NavigationGroup): Module[] {
    return modules.filter((item) => group.keys.includes(item.key));
  }

  async ngOnInit(): Promise<void> {
    this.subscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.loadPage());
    await this.loadPage();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async loadPage(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    this.pageError.set('');
    this.success.set('');
    this.mobileMenu.set(false);

    const parts = this.router.url.split('?')[0].split('/').filter(Boolean);
    const nextSection = parts[1] ?? 'dashboard';
    if (nextSection !== this.section()) {
      this.offset = 0;
      this.query = '';
      this.userRoleFilter = 'all';
      this.recordStatusFilter = 'all';
      this.paymentStatusFilter = '';
      this.availabilityFilter = 'all';
      this.lookupFilters = {};
    }
    this.section.set(nextSection);

    const module = this.module();
    this.mode.set(
      parts[2] === 'new' ? 'create' : parts[3] === 'edit' ? 'edit' : parts[2] && parts[2] !== 'new' ? 'detail' : 'list'
    );

    try {
      if (this.section() === 'dashboard' || this.section() === 'analytics') {
        await this.loadDashboard();
      } else if (this.section() === 'catalog') {
        await this.loadCatalog();
      } else if (this.section() === 'profile' || this.section() === 'settings') {
        this.profileForm = this.profilePayload(this.api.user()!);
      } else if (module) {
        if (this.mode() === 'list') {
          await this.loadRows();
          if (module.fields.some((field) => field.lookup)) {
            await this.loadLookups(module.fields);
            this.hydrateRows();
          }
          if (['users', 'farmer-profiles', 'business-buyer-profiles'].includes(module.key)) {
            const response = await Promise.allSettled([this.analyticsApi.overview()]);
            if (response[0].status === 'fulfilled') this.analytics.set(response[0].value as any);
          }
        } else if (this.mode() === 'create') {
          if (!module.create) throw new Error(`${module.title} cannot be created.`);
          this.form = {};
          await this.loadLookups(module.fields);
        } else {
          const id = Number(parts[2]);
          let row =
            this.mode() === 'edit' && history.state?.row ? history.state.row : await this.getResource(module.key, id);
          if (['farmer-profiles', 'business-buyer-profiles'].includes(module.key) && row.user_id) {
            try {
              const account = await this.profileApi.getUser(Number(row.user_id));
              row = {
                ...row,
                account_name: `${account['first_name']} ${account['last_name']}`,
                account_email: account['email'],
                account_phone: account['phone'],
                avatar: account['avatar'],
              };
            } catch {
              /* Keep profile accessible if account lookup is unavailable */
            }
          }
          this.selected.set(row);
          if (this.mode() === 'edit') {
            this.form = this.toForm(row, module.fields);
            await this.loadLookups(module.fields);
          }
          if (module.key === 'orders' && this.mode() === 'detail') {
            this.orderItems.set(await this.orderItemApi.listForOrder(id, { offset: 0, limit: 100 }));
          }
        }
      } else if (['analytics', 'profile'].includes(this.section())) {
        /* built-in pages */
      } else {
        this.pageError.set('That admin section could not be found.');
      }
    } catch (e) {
      this.pageError.set(this.message(e));
    } finally {
      this.loading.set(false);
    }
  }

  async loadDashboard(): Promise<void> {
    const results = await Promise.allSettled([
      this.analyticsApi.overview(),
      this.orderApi.list({ offset: 0, limit: 5 }),
      this.reportApi.list({ offset: 0, limit: 5 }),
      this.profileApi.listFarmerProfiles({ offset: 0, limit: 100 }),
      this.profileApi.listBusinessProfiles({ offset: 0, limit: 100 }),
      this.profileApi.listUsers({ offset: 0, limit: 5 }),
    ]);

    if (results[0].status === 'rejected') throw results[0].reason;
    this.analytics.set(results[0].value as any);
    this.orders.set(results[1].status === 'fulfilled' ? (results[1].value as any[]) : []);
    this.reports.set(results[2].status === 'fulfilled' ? (results[2].value as any[]) : []);
    this.recentUsers.set(results[5].status === 'fulfilled' ? (results[5].value as any[]) : []);

    const farmers = results[3].status === 'fulfilled' ? (results[3].value as any[]) : [];
    const businesses = results[4].status === 'fulfilled' ? (results[4].value as any[]) : [];
    this.pendingProfiles.set([
      ...farmers.filter((x) => x.verification_status === 'pending').map((x) => ({ ...x, name: x.farm_name, kind: 'farmer' })),
      ...businesses.filter((x) => x.verification_status === 'pending').map((x) => ({ ...x, name: x.business_name, kind: 'business' })),
    ].slice(0, 5));
  }

  async loadCatalog(): Promise<void> {
    const results = await Promise.allSettled([
      this.analyticsApi.overview(),
      this.productApi.list({ offset: 0, limit: 5 }),
      this.categoryApi.list({ offset: 0, limit: 500 }),
      this.harvestApi.list({ offset: 0, limit: 5 }),
    ]);
    if (results.every((result) => result.status === 'rejected')) {
      throw new Error('Catalog data is currently unavailable.');
    }
    this.analytics.set(results[0].status === 'fulfilled' ? (results[0].value as any) : {});
    this.catalogProducts.set(results[1].status === 'fulfilled' ? (results[1].value as any[]) : []);
    this.catalogCategories.set(results[2].status === 'fulfilled' ? (results[2].value as any[]) : []);
    this.catalogBatches.set(results[3].status === 'fulfilled' ? (results[3].value as any[]) : []);
  }

  async loadRows(): Promise<void> {
    const data = await this.listResource(this.module()!.key, { offset: this.offset, limit: this.limit + 1 });
    this.hasNext = data.length > this.limit;
    let pageRows = data.slice(0, this.limit);

    if (['farmer-profiles', 'business-buyer-profiles', 'orders', 'crop-reports', 'notifications'].includes(this.section())) {
      const [usersResult, productsResult] = await Promise.allSettled([
        this.profileApi.listUsers({ offset: 0, limit: 500 }),
        this.productApi.list({ offset: 0, limit: 500 }),
      ]);
      const users = usersResult.status === 'fulfilled' ? (usersResult.value as any[]) : [];
      const products = productsResult.status === 'fulfilled' ? (productsResult.value as any[]) : [];
      const userById = new Map(users.map((user) => [user.id, user]));
      const productById = new Map(products.map((product) => [product.id, product]));

      pageRows = pageRows.map((row) => {
        const user = userById.get(row.user_id ?? row.buyer_id ?? row.farmer_id);
        const product = productById.get(row.product_id);
        return {
          ...row,
          ...(user
            ? {
                user_name: `${user.first_name} ${user.last_name}`,
                user_email: user.email,
                recipient_name: `${user.first_name} ${user.last_name}`,
                recipient_email: user.email,
                avatar: user.avatar,
                buyer_name: `${user.first_name} ${user.last_name}`,
                farmer_name: row.farmer_id ? `${user.first_name} ${user.last_name}` : row.farmer_name,
              }
            : {}),
          ...(product ? { product_name: product.name, crop_name: product.name } : {}),
        };
      });
    }

    this.rows.set(pageRows);
    this.filteredRows.set(pageRows);
    this.filterRows();
  }

  private listResource(key: string, query: { offset: number; limit: number }): Promise<any[]> {
    switch (key) {
      case 'users':
        return this.profileApi.listUsers(query);
      case 'categories':
        return this.categoryApi.list(query);
      case 'products':
        return this.productApi.list(query);
      case 'harvest-batches':
        return this.harvestApi.list(query);
      case 'farmer-profiles':
        return this.profileApi.listFarmerProfiles(query);
      case 'business-buyer-profiles':
        return this.profileApi.listBusinessProfiles(query);
      case 'market-prices':
        return this.marketPriceApi.list(query);
      case 'advisories':
        return this.agricultureApi.list(query);
      case 'crop-reports':
        return this.reportApi.list(query);
      case 'notifications':
        return this.notificationApi.list(query);
      case 'orders':
        return this.orderApi.list(query);
      default:
        return Promise.reject(new Error('Unsupported admin resource.'));
    }
  }

  private getResource(key: string, id: number): Promise<any> {
    switch (key) {
      case 'users':
        return this.profileApi.getUser(id);
      case 'categories':
        return this.categoryApi.get(id);
      case 'products':
        return this.productApi.get(id);
      case 'harvest-batches':
        return this.harvestApi.get(id);
      case 'farmer-profiles':
        return this.profileApi.getFarmerProfile(id);
      case 'business-buyer-profiles':
        return this.profileApi.getBusinessProfile(id);
      case 'market-prices':
        return this.marketPriceApi.get(id);
      case 'advisories':
        return this.agricultureApi.get(id);
      case 'crop-reports':
        return this.reportApi.get(id);
      case 'notifications':
        return this.notificationApi.get(id);
      case 'orders':
        return this.orderApi.get(id);
      default:
        return Promise.reject(new Error('Unsupported admin resource.'));
    }
  }

  private createResource(key: string, data: Record<string, any>): Promise<any> {
    switch (key) {
      case 'users':
        return this.profileApi.createUser(data);
      case 'categories':
        return this.categoryApi.create(data);
      case 'products':
        return this.productApi.create(data);
      case 'harvest-batches':
        return this.harvestApi.create(data);
      case 'farmer-profiles':
        return this.profileApi.createFarmerProfile(data);
      case 'business-buyer-profiles':
        return this.profileApi.createBusinessProfile(data);
      case 'market-prices':
        return this.marketPriceApi.create(data);
      case 'advisories':
        return this.agricultureApi.create(data);
      case 'crop-reports':
        return this.reportApi.create(data);
      case 'notifications':
        return this.notificationApi.create(data);
      default:
        return Promise.reject(new Error('This resource cannot be created here.'));
    }
  }

  private updateResource(key: string, id: number, data: Record<string, any>): Promise<any> {
    switch (key) {
      case 'users':
        return this.profileApi.updateUser(id, data);
      case 'categories':
        return this.categoryApi.update(id, data);
      case 'products':
        return this.productApi.update(id, data);
      case 'harvest-batches':
        return this.harvestApi.update(id, data);
      case 'farmer-profiles':
        return this.profileApi.updateFarmerProfile(id, data);
      case 'business-buyer-profiles':
        return this.profileApi.updateBusinessProfile(id, data);
      case 'market-prices':
        return this.marketPriceApi.update(id, data);
      case 'advisories':
        return this.agricultureApi.update(id, data);
      case 'crop-reports':
        return this.reportApi.update(id, data);
      case 'notifications':
        return this.notificationApi.update(id, data);
      case 'orders':
        return this.orderApi.update(id, data);
      default:
        return Promise.reject(new Error('Unsupported admin resource.'));
    }
  }

  private deleteResource(key: string, id: number): Promise<void> {
    switch (key) {
      case 'users':
        return this.profileApi.removeUser(id);
      case 'categories':
        return this.categoryApi.remove(id);
      case 'products':
        return this.productApi.remove(id);
      case 'harvest-batches':
        return this.harvestApi.remove(id);
      case 'farmer-profiles':
        return this.profileApi.removeFarmerProfile(id);
      case 'business-buyer-profiles':
        return this.profileApi.removeBusinessProfile(id);
      case 'market-prices':
        return this.marketPriceApi.remove(id);
      case 'advisories':
        return this.agricultureApi.remove(id);
      case 'crop-reports':
        return this.reportApi.remove(id);
      case 'notifications':
        return this.notificationApi.remove(id);
      default:
        return Promise.reject(new Error('This resource cannot be deleted here.'));
    }
  }

  filterRows(): void {
    const q = this.query.toLowerCase().trim();
    this.filteredRows.set(
      this.rows().filter((row) => {
        const matchText =
          !q || Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q));
        const matchRole =
          this.section() !== 'users' || this.userRoleFilter === 'all' || row.role === this.userRoleFilter;
        const status = row.status ?? row.verification_status ?? row.is_read;
        const matchStatus = this.recordStatusFilter === 'all' || status === this.recordStatusFilter;
        const matchPayment =
          this.section() !== 'orders' || !this.paymentStatusFilter || row.payment_status === this.paymentStatusFilter;
        const matchAvailability =
          this.section() !== 'products' ||
          this.availabilityFilter === 'all' ||
          (this.availabilityFilter === 'available'
            ? Number(row.available_quantity) > 0
            : Number(row.available_quantity) <= 0);
        const matchLookups = Object.entries(this.lookupFilters).every(
          ([key, value]) => !value || String(row[key]) === value
        );
        return matchText && matchRole && matchStatus && matchPayment && matchAvailability && matchLookups;
      })
    );
  }

  async page(direction: number): Promise<void> {
    this.offset = Math.max(0, this.offset + direction * this.limit);
    this.loading.set(true);
    try {
      await this.loadRows();
    } catch (e) {
      this.error.set(this.message(e));
    } finally {
      this.loading.set(false);
    }
  }

  columns(): string[] {
    const map: Record<string, string[]> = {
      users: ['id', 'first_name', 'email', 'phone', 'role', 'status', 'created_at'],
      categories: ['id', 'image', 'name', 'description'],
      products: ['id', 'name', 'farmer_name', 'category_name', 'price_per_unit', 'available_quantity', 'status'],
      'harvest-batches': ['id', 'batch_code', 'product_name', 'farmer_name', 'quantity', 'remaining_quantity', 'status'],
      'farmer-profiles': ['avatar', 'id', 'farm_name', 'user_name', 'user_email', 'municipality', 'province', 'verification_status'],
      'business-buyer-profiles': ['avatar', 'id', 'business_name', 'business_type', 'user_name', 'province', 'verification_status'],
      'market-prices': ['id', 'product_name', 'market_name', 'municipality', 'average_price', 'recorded_date', 'verified_by'],
      advisories: ['id', 'title', 'category', 'municipality', 'severity', 'status'],
      'crop-reports': ['id', 'report_type', 'farmer_name', 'product_name', 'severity', 'status', 'created_at'],
      notifications: ['id', 'title', 'recipient_name', 'recipient_email', 'is_read', 'created_at'],
      orders: ['id', 'order_number', 'buyer_name', 'total_amount', 'status', 'payment_status'],
    };
    return (map[this.section()] ?? (this.rows().length ? Object.keys(this.rows()[0]).slice(0, 6) : [])).filter((k) =>
      this.rows().some((row) => k in row)
    );
  }

  statusOptions(): string[] {
    const values = this.rows().map((row) => row.status ?? row.verification_status ?? row.is_read).filter(Boolean);
    return [...new Set(values)] as string[];
  }

  paymentStatusOptions(): string[] {
    return [...new Set(this.rows().map((row) => row.payment_status).filter(Boolean))] as string[];
  }

  lookupFields(): Field[] {
    return [...new Map((this.module()?.fields ?? []).filter((field) => field.lookup).map((field) => [field.key, field])).values()];
  }

  detailEntries(): [string, any][] {
    return Object.entries(this.selected() ?? {}).filter(([k]) => !['avatar', 'image'].includes(k));
  }

  editableFields(): Field[] {
    return this.module()!.fields.filter(
      (f) =>
        !(this.mode() === 'create' && this.module()!.key === 'orders') &&
        !(this.module()!.key === 'users' && this.mode() === 'edit' && f.key === 'password') &&
        !(this.module()!.key === 'harvest-batches' && f.key === 'batch_code')
    );
  }

  required(field: Field): boolean {
    return !!field.required || (this.module()?.key === 'users' && this.mode() === 'create' && field.key === 'password');
  }

  managementDescription(): string {
    return (
      ({
        users: 'Manage farmers, individual buyers, commercial business buyers, and administrator accounts.',
        'farmer-profiles': 'Review farmer registrations, agricultural land records, and verification status.',
        'business-buyer-profiles': 'Manage commercial accounts, restaurant partners, and wholesale buyer registrations.',
        products: 'Manage agricultural products, marketplace listings, quality grades, and pricing.',
        categories: 'Organize agricultural commodities and produce into marketplace categories.',
        'harvest-batches': 'Monitor farm produce harvests, expiration dates, and warehouse batch availability.',
        orders: 'Track customer order fulfillment pipeline, payment statuses, and delivery notes.',
        'market-prices': 'Record and verify regional commodity market prices across municipalities.',
        advisories: 'Publish weather alerts, pest management guidance, and government advisories.',
        'crop-reports': 'Audit crop damage, flood incidents, and pest reports submitted by farmers.',
        notifications: 'Monitor automated platform notifications sent to FarmerLink users.',
      } as Record<string, string>)[this.section()] ?? `Review and manage ${this.module()?.title.toLowerCase()} across FarmerLink.`
    );
  }

  singular(): string {
    return this.module()?.title.replace(/s$/, '') ?? 'record';
  }

  label(key: string): string {
    if (key === 'first_name') return 'User';
    if (key === 'farmer_name') return 'Farmer';
    if (key === 'category_name') return 'Category';
    if (key === 'product_name' || key === 'crop_name') return 'Product';
    if (key === 'user_name' || key === 'buyer_name') return key === 'buyer_name' ? 'Buyer' : 'Account';
    if (key === 'user_email') return 'Account email';
    if (key === 'account_name') return 'Account holder';
    if (key === 'account_email') return 'Account email';
    if (key === 'account_phone') return 'Account phone';
    return key.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  formatValue(value: any): string {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  displayCell(row: any, column: string): string {
    const value = row[column];
    if (value === null || value === undefined || value === '') return '—';
    if (column.includes('price') || column === 'average_price' || column === 'total_amount') {
      return `₱${this.money(value)}`;
    }
    if (column.endsWith('_id')) return `#${value}`;
    if (column.endsWith('_at') || column.endsWith('_date')) return this.date(value);
    return this.formatValue(value);
  }

  date(value: any): string {
    if (!value) return '—';
    const d = new Date(value);
    return Number.isNaN(d.valueOf())
      ? '—'
      : new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
  }

  money(value: unknown): string {
    return Number(value ?? 0).toLocaleString('en-PH', { maximumFractionDigits: 2 });
  }

  num(value: any): string {
    return value === null || value === undefined || value === '' ? '—' : Number(value).toLocaleString('en-PH');
  }

  firstName(): string {
    return this.api.user()?.first_name || 'Administrator';
  }

  displayName(): string {
    const u = this.api.user();
    return u ? `${u.first_name} ${u.last_name}` : 'Administrator';
  }

  async startCreate(): Promise<void> {
    this.form = {};
    this.error.set('');
    try {
      await this.loadLookups(this.module()!.fields);
      this.mode.set('create');
    } catch (e) {
      this.error.set(this.message(e));
    }
  }

  async startEdit(row: any): Promise<void> {
    this.selected.set(row);
    this.form = this.toForm(row, this.module()!.fields);
    this.error.set('');
    try {
      await this.loadLookups(this.module()!.fields);
      this.mode.set('edit');
    } catch (e) {
      this.error.set(this.message(e));
    }
  }

  private async loadLookups(fields: Field[]): Promise<void> {
    const keys = [...new Set(fields.map((f) => f.lookup).filter((x): x is string => !!x))];
    const result = await Promise.all(keys.map(async (key) => [key, await this.lookupList(key)] as const));
    this.lookupRows = Object.fromEntries(result);
  }

  private lookupList(key: string): Promise<any[]> {
    switch (key) {
      case 'users':
        return this.profileApi.listUsers({ offset: 0, limit: 500 });
      case 'categories':
        return this.categoryApi.list({ offset: 0, limit: 500 });
      case 'products':
        return this.productApi.list({ offset: 0, limit: 500 });
      default:
        return Promise.resolve([]);
    }
  }

  hydrateRows(): void {
    const displayKeys: Record<string, string> = {
      farmer_id: 'farmer_name',
      category_id: 'category_name',
      product_id: 'product_name',
      user_id: 'user_name',
    };
    const fields = this.module()?.fields ?? [];
    this.rows.set(
      this.rows().map((row) => {
        const additions: Record<string, any> = {};
        for (const field of fields) {
          if (!field.lookup || !displayKeys[field.key]) continue;
          const match = (this.lookupRows[field.lookup] ?? []).find(
            (item) => String(item.id) === String(row[field.key])
          );
          if (match) {
            const target = displayKeys[field.key];
            additions[target] =
              field.lookup === 'users' ? `${match.first_name} ${match.last_name}` : match.name ?? match.title ?? `#${match.id}`;
            if (field.lookup === 'users' && field.key === 'user_id') {
              additions['user_email'] = match.email;
              additions['avatar'] = match.avatar;
            }
          }
        }
        return { ...row, ...additions };
      })
    );
    this.filterRows();
  }

  lookupOptions(field: Field): any[] {
    const rows = this.lookupRows[field.lookup ?? ''] ?? [];
    return field.role ? rows.filter((row) => row.role === field.role) : rows;
  }

  lookupLabel(key: string, row: any): string {
    if (key === 'users') return `#${row.id} · ${row.first_name} ${row.last_name} · ${row.email}`;
    return `#${row.id} · ${row.name ?? row.title ?? 'Record'}`;
  }

  openDetail(id: number): void {
    this.router.navigate(['/admin', this.section(), id]);
  }

  goList(): void {
    this.router.navigate(['/admin', this.section()]);
  }

  toForm(row: any, fields: Field[]): Record<string, any> {
    const result: Record<string, any> = {};
    for (const f of fields) {
      let value = row[f.key] ?? '';
      if (f.type === 'datetime-local' && value) {
        value = new Date(value).toISOString().slice(0, 16);
      }
      result[f.key] = value;
    }
    return result;
  }

  async save(): Promise<void> {
    this.saving.set(true);
    this.error.set('');
    try {
      const module = this.module()!;
      const payload: Record<string, any> = {};
      for (const field of this.editableFields()) {
        const value = this.form[field.key];
        if (field.type === 'image' && this.mode() === 'edit' && value === this.selected()?.[field.key]) continue;
        if (value !== '' && value !== undefined && value !== null) {
          payload[field.key] =
            field.lookup || field.type === 'number'
              ? Number(value)
              : field.type === 'datetime-local'
                ? new Date(value).toISOString()
                : value;
        } else if (this.mode() === 'edit' && value === '') {
          payload[field.key] = null;
        }
      }
      if (module.key === 'users' && this.mode() === 'create' && payload['middle_name'] === undefined) {
        payload['middle_name'] = '';
      }
      if (module.key === 'users' && this.mode() === 'edit' && !payload['password']) {
        delete payload['password'];
      }
      const id = this.selected()?.id;
      if (this.mode() === 'create') {
        await this.createResource(module.key, payload);
      } else {
        await this.updateResource(module.key, id, payload);
      }
      this.announce(`${this.singular()} ${this.mode() === 'create' ? 'created' : 'updated'} successfully.`);
      this.router.navigate(['/admin', module.key]);
    } catch (e) {
      this.error.set(this.message(e));
    } finally {
      this.saving.set(false);
    }
  }

  async remove(row: any): Promise<void> {
    this.deleteCandidate.set(row);
  }

  async confirmDelete(): Promise<void> {
    const row = this.deleteCandidate();
    if (!row) return;
    this.deleteBusy.set(true);
    try {
      await this.deleteResource(this.module()!.key, row.id);
      this.deleteCandidate.set(null);
      this.announce(`${this.singular()} deleted successfully.`);
      if (this.mode() === 'detail') this.goList();
      else await this.loadRows();
    } catch (e) {
      this.error.set(this.message(e));
    } finally {
      this.deleteBusy.set(false);
    }
  }

  async saveProfile(): Promise<void> {
    this.saving.set(true);
    this.error.set('');
    this.success.set('');
    try {
      const payload = { ...this.profileForm };
      if (!payload['password']) delete payload['password'];
      if (payload['avatar'] === this.api.user()?.avatar) delete payload['avatar'];
      const updated = await this.profileApi.updateUser(this.api.user()!.id, payload);
      this.api.user.set(updated);
      this.success.set('Your administrator profile has been updated.');
    } catch (e) {
      this.error.set(this.message(e));
    } finally {
      this.saving.set(false);
    }
  }

  profilePayload(user: AdminUser): Record<string, any> {
    return {
      first_name: user.first_name,
      middle_name: user.middle_name ?? '',
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar ?? null,
      password: '',
    };
  }

  toggleSidebar(): void {
    if (window.matchMedia('(max-width: 768px)').matches) {
      this.mobileMenu.set(!this.mobileMenu());
    } else {
      this.sidebarCollapsed.set(!this.sidebarCollapsed());
    }
  }

  closeOverlays(): void {
    this.themeMenu.set(false);
    this.profileMenu.set(false);
    this.notificationMenu.set(false);
    this.searchOpen.set(false);
  }

  onWorkspaceClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-anchor') && !target.closest('.topbar-search')) {
      this.closeOverlays();
    }
  }

  toggleThemeMenu(): void {
    const opening = !this.themeMenu();
    this.closeOverlays();
    this.themeMenu.set(opening);
  }

  toggleProfileMenu(): void {
    const opening = !this.profileMenu();
    this.closeOverlays();
    this.profileMenu.set(opening);
  }

  async toggleNotifications(): Promise<void> {
    const opening = !this.notificationMenu();
    this.closeOverlays();
    this.notificationMenu.set(opening);
    if (opening && !this.headerNotifications().length) {
      try {
        this.headerNotifications.set(await this.notificationApi.list({ offset: 0, limit: 8 }));
      } catch (e) {
        this.announce(this.message(e));
      }
    }
  }

  announce(message: string): void {
    this.toast.set(message);
    setTimeout(() => {
      if (this.toast() === message) this.toast.set('');
    }, 4000);
  }

  async signOut(): Promise<void> {
    this.api.logout();
    await this.router.navigate(['/login']);
  }

  private message(e: unknown): string {
    return e instanceof Error ? e.message : 'Something went wrong. Please try again.';
  }
}
