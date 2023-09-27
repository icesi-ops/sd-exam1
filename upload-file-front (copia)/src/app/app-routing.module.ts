import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadFileComponent } from './pages/upload-file/upload-file.component';
import { ShowFileComponent } from './pages/show-file/show-file.component';

const routes: Routes = [
  {
    path:"", redirectTo:"upload", pathMatch: "full"
  },
  {
    path:"upload" , component:UploadFileComponent
  },
  {
    path:"show", component:ShowFileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
