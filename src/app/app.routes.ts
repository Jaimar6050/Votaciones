import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('./pages/login/login.component').then(c => c.LoginComponent),
        //component:LoginComponent,
        pathMatch:'full'
    },{
        path:'menu',
        loadComponent: () => import('./pages/menu/menu.component').then(c => c.MenuComponent),
        children:[
            {
                path:'persona',
                loadComponent:() => import('./pages/persona/persona.component').then(c =>c.PersonaComponent) 
            },{
                path:'partidos',
                loadComponent:() => import('./pages/partido/partido.component').then(c =>c.PartidoComponent)
            },{
                path:'cronograma',
                loadComponent:() => import('./pages/cronograma/cronograma.component').then(c =>c.CronogramaComponent)
            },{
                path:'propuestas',
                loadComponent:() => import('./pages/propuesta/propuesta.component').then(c =>c.PropuestaComponent)
            }

        ]
    },
];
