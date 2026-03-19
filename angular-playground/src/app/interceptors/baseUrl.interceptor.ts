import { HttpInterceptorFn } from '@angular/common/http';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({
    url: `http://localhost:3214/${req.url}`,
  });

  return next(apiReq);
};
