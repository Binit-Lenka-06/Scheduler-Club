import { Suspense } from 'react'
import SearchBar from './searchbar'
import getFormElements from '@/actions/getFormElements'
import getRegistrations from '@/actions/getRegistration'
 
// This component passed as a fallback to the Suspense boundary
// will be rendered in place of the search bar in the initial HTML.
// When the value is available during React hydration the fallback
// will be replaced with the `<SearchBar>` component.
function SearchBarFallback() {
  return <>placeholder</>
}
 
export default async function Page() {
  const formsfetched = await getFormElements()
  const registeriesFetched = await getRegistrations()
  return (
    <>
      <div className='scrollbar'>
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar formsfetched={formsfetched} fetchedRegisters={registeriesFetched}/>
        </Suspense>
      </div>
    </>
  )
}