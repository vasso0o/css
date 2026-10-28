import { Routes } from '@angular/router';
import { PageComponent } from './page';

export const routes: Routes = [
  { path: '', component: PageComponent },
  { path: ':slug', component: PageComponent },
];
