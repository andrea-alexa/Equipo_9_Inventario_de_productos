import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// Aquí le decimos a Angular que arranque usando el AppComponent correcto
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));