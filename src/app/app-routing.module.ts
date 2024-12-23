import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { EstoquePageComponent } from './pages/estoque-page/estoque-page.component';
import { ReceitaPageComponent } from './pages/receita-page/receita-page.component';
import { ProducaoPageComponent } from './pages/producao-page/producao-page.component';
import { AuthGuard } from './auth.guard';
import { ConfiguracoesPageComponent } from './pages/configuracoes-page/configuracoes-page.component';
import { EntradaSaidaPageComponent } from './pages/entrada-saida-page/entrada-saida-page.component';
import { VendasPageComponent } from './pages/vendas-page/vendas-page.component';
import { ParametrizacaoPageComponent } from './pages/parametrizacao-page/parametrizacao-page.component';
import { ResumoPageComponent } from './pages/resumo-page/resumo-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'estoque/cadastro',
    component: EstoquePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'receitas',
    component: ReceitaPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'producoes',
    component: ProducaoPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'configuracoes/cadastro-usuario',
    component: ConfiguracoesPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'estoque/entrada-saida',
    component: EntradaSaidaPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vendas/cadastro',
    component: VendasPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vendas/resumo',
    component: ResumoPageComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'configuracoes/parametrizacao',
    component: ParametrizacaoPageComponent,
    canActivate: [AuthGuard],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
