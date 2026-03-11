const store = useServiceStore()

export function usePage() {
  // Split service groups into pages for carousel-like scrolling
  const itemsPerPage = 6
  const totalPages = computed(() => Math.ceil(store.details.length / itemsPerPage))

  // Create an array of pages, each containing up to 6 service groups
  const pages = computed(() => {
    const result = []

    for (let i = 0; i < totalPages.value; i++) {
      const startIndex = i * itemsPerPage
      const endIndex = Math.min(startIndex + itemsPerPage, store.details.length)
      result.push(store.details.slice(startIndex, endIndex))
    }

    return result
  })

  // Track current page for pagination indicators
  const currentPage = ref(0)

  // Handle scroll events to update current page indicator
  const carouselRef = ref<HTMLElement | null>(null)

  // Judge if scroll
  const isScrolling = ref(false)
  let scrollTimer: number | null = null

  function handleScroll() {
    if (!carouselRef.value) return

    isScrolling.value = true

    if (scrollTimer) clearTimeout(scrollTimer)

    scrollTimer = window.setTimeout(() => {
      isScrolling.value = false
    }, 100)
    
    const scrollLeft = carouselRef.value.scrollLeft
    const scrollWidth = carouselRef.value.scrollWidth
    const clientWidth = carouselRef.value.clientWidth
    
    // Calculate the page width based on the 80% width setting
    const pageWidth = clientWidth * 0.8
    
    // Calculate current page based on scroll position
    // For the last page, we need special handling
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      // We're at the end of the scroll, set to last page
      currentPage.value = totalPages.value - 1
    } else {
      // Calculate the page based on scroll position and page width
      currentPage.value = Math.round(scrollLeft / pageWidth)
    }
  }

  // Function to scroll to a specific page
  function scrollToPage(pageIndex: number) {
    if (!carouselRef.value) return
    
    // Calculate the page width based on the 80% width setting
    const pageWidth = carouselRef.value.clientWidth * 0.8
    
    // Calculate the scroll position
    let scrollPosition = pageIndex * pageWidth
    
    // If it's the last page, ensure we scroll to the end
    if (pageIndex === totalPages.value - 1) {
      scrollPosition = carouselRef.value.scrollWidth - carouselRef.value.clientWidth
    }
    
    carouselRef.value.scrollTo({ 
      left: scrollPosition, 
      behavior: 'smooth' 
    })
  }

  return {
    pages,
    itemsPerPage,
    totalPages,
    currentPage,
    carouselRef,
    isScrolling,
    
    handleScroll,
    scrollToPage,
  }
}
