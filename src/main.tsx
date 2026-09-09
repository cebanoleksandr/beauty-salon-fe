import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './network/queryClient.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      {/* <Provider store={store}> */}
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      {/* </Provider> */}
    </Suspense>
  </StrictMode>,
)
