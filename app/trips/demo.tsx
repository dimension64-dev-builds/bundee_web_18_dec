"use client"


const features = [
    { name: 'Trip Start Date / Time', description: 'Designed by Good Goods, Inc.' },
    { name: 'Trip End Date / Time', description: 'Solid walnut base with rare earth magnets and powder coated steel card cover' },
    { name: 'Pickup Locations', description: '6.25" x 3.55" x 1.15"' },
    { name: 'Per Day Cost', description: 'Hand sanded and finished with natural oil' },
    { name: 'Total Cost', description: 'Wood card tray and 3 refill packs' },
    { name: 'Considerations', description: 'Made from natural materials. Grain and color vary with each item.' },
]


const product = {
    name: 'Toyota Camry 2022',
    price: 45,
    href: '#',
    breadcrumbs: [
        { id: 1, name: 'Home', href: '#' },
        { id: 2, name: 'Trips', href: '#' },
        { id: 3, name: 'TripDetails', href: '#' },
    ],
    images: [
        {
            src: 'https://images.turo.com/media/vehicle/images/CkpW7zKPTe6oKqK-AR42mw.2880x1400.jpg',
            alt: 'Toyota Camry 2022',
        },
        {
            src: 'https://images.turo.com/media/vehicle/images/01ygPeLERWKvRFm--DKVUw.2880x1400.jpg',
            alt: 'Toyota Camry 2022',
        },
        {
            src: 'https://images.turo.com/media/vehicle/images/Ss0_VJuQQReUzao4csEpSQ.2880x1400.jpg',
            alt: 'Toyota Camry 2022',
        },
        {
            src: 'https://images.turo.com/media/vehicle/images/b9cC7dlLTjeziqwrINpEYA.2880x1400.jpg',
            alt: 'Toyota Camry 2022',
        },
    ],

    description:
        "This is a beautiful and comfortable car safe and security this is a good opportunity to get a nice trip in your stay in the San Francisco. Clear windows, eco gas, and if you like turbo. Leather seat black and red car Toyota Camry 2022 the best car to drive",
    highlights: [
        'Electric & Gasoline Both',
        'Loved by all of our Renters',
        'Automatic Transition',
        'Android Auto',
        'Bluetooth GPS, and USB Chargerand More.',
    ],
    details:
        'Add optional Extras to your trip at checkout.',
}

export default function Example() {
    return (
        <section>
            <div className="bg-white">
                <nav aria-label="Breadcrumb" className="mt-8">
                    <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        {product.breadcrumbs.map((breadcrumb) => (
                            <li key={breadcrumb.id}>
                                <div className="flex items-center">
                                    <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                                        {breadcrumb.name}
                                    </a>
                                    <svg
                                        width={16}
                                        height={20}
                                        viewBox="0 0 16 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                        className="h-5 w-4 text-gray-300"
                                    >
                                        <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                    </svg>
                                </div>
                            </li>
                        ))}
                        <li className="text-sm">
                            <a href={product.href} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                                {product.name}
                            </a>
                        </li>
                    </ol>
                </nav>

                <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Toyota Camry 2022</h2>
                        <p className="mt-4 text-gray-500">
                            The walnut wood card tray is precision milled to perfectly fit a stack of Focus cards. The powder coated
                            steel divider separates active cards from new ones, or can be used to archive important task lists.
                        </p>

                        <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                            {features.map((feature) => (
                                <div key={feature.name} className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">{feature.name}</dt>
                                    <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
                                </div>
                            ))}
                        </dl>


                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
                        <img
                            src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg"
                            alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                            className="rounded-lg bg-gray-100"
                        />
                        <img
                            src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-02.jpg"
                            alt="Top down view of walnut card tray with embedded magnets and card groove."
                            className="rounded-lg bg-gray-100"
                        />
                        <img
                            src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-03.jpg"
                            alt="Side of walnut card tray with card groove and recessed card area."
                            className="rounded-lg bg-gray-100"
                        />
                        <img
                            src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-04.jpg"
                            alt="Walnut card tray filled with cards and card angled in dedicated groove."
                            className="rounded-lg bg-gray-100"
                        />
                    </div>
                </div>
            </div>


              {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={product.images[0].src}
              alt={product.images[0].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product.images[1].src}
                alt={product.images[1].alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product.images[2].src}
                alt={product.images[2].alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img
              src={product.images[3].src}
              alt={product.images[3].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
        a
<div className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                {/* Description and details */}
                <div>
                    <h3 className="sr-only">Description</h3>

                    <div className="space-y-6">
                        <p className="text-base text-gray-900">{product.description}</p>
                    </div>
                </div>

                <div className="mt-10">
                    <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

                    <div className="mt-4">
                        <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                            {product.highlights.map((highlight) => (
                                <li key={highlight} className="text-gray-400">
                                    <span className="text-gray-600">{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-sm font-medium text-gray-900">Details</h2>

                    <div className="mt-4 space-y-6">
                        <p className="text-sm text-gray-600">{product.details}</p>
                    </div>
                </div>
            </div>
            </div>

        </section>

    )
}
