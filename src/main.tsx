import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './network/queryClient.ts'
import router from './routing'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      {/* <Provider store={store}> */}
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      {/* </Provider> */}
    </Suspense>
  </StrictMode>,
)
