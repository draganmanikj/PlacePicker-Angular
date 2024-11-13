import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';

function logginInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) { 
    return next(request);
}

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(
        withInterceptors([
            logginInterceptor
        ])
    )]
}).catch((err) => console.error(err));
