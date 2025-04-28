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
            },
            //{
            //     path:'usuario',
            //     loadComponent:() => import('./pages/usuario/usuario.component').then(c => c.UsuarioComponent)
            // }
        ]
    },
];
