// import {Component, Injectable, OnInit} from '@angular/core';
// import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
// import {Observable} from "rxjs";
//
// @Injectable()
// export class BlogInterceptorComponent implements HttpInterceptor {
//   constructor(public auth: AuthService) {}
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//
//     // Clone the request to add the new header
//     const clonedRequest = req.clone({ headers: req.headers.set('Set-Cookie', 'jsessionid=' + this.auth.getJSessionId()) });
//
//     // Pass control to the next request
//     return next.handle(clonedRequest);
//   }
// }
