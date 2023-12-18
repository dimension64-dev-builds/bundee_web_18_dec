import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';

const TripsList = ({ tripsData }) => {
    const formatDateTime = datetime => `${datetime.getFullYear()}-${(datetime.getMonth() + 1).toString().padStart(2, '0')}-${datetime.getDate().toString().padStart(2, '0')} ${datetime.toTimeString().split(' ')[0]}`;

    // Check if tripsData is an array and has elements
    if (!Array.isArray(tripsData) || tripsData.length === 0) {
        return <div>No trips available.</div>;
    }

    function handleNavigateToDetails(tripId: any) {
        window.location.href = `/trips/${tripId}`;
    }

    return (
        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 lg:grid-cols-2 xl:gap-x-8'>
            {tripsData.map(trip => (
                <div onClick={() => handleNavigateToDetails(trip.tripid)} className='group relative cursor-pointer flex flex-col lg:flex-row shadow px-4 py-4' key={trip.tripid}>
                    {/* Image Section */}
                    <div className='lg:w-1/2.8 lg:pr-4'>
                        <div className='aspect-video w-full overflow-hidden rounded-md bg-neutral-200 lg:aspect-video group-hover:opacity-75 lg:h-44'>
                            <img src={trip.vehicleImages[0]?.imagename} alt={`${trip.vehmake} ${trip.vehmodel}`} className='h-full w-full object-cover group-hover:scale-110 transition-all ease-in-out object-center lg:h-full lg:w-full' />
                        </div>
                    </div>

                    {/* Text Content Section */}
                    <div className='lg:w-1/2'>
                        <div className='mt-3 flex justify-between items-center'>
                            <div>
                                <Link href={`/trip/${trip.tripid}`} className='text-sm text-neutral-900 p-0 font-bold'>
                                    {`${trip.vehmake} ${trip.vehmodel} (${trip.vehyear})`}
                                </Link>

                                <div className='flex flex-col gap-2'>
                                    <div className='flex mt-1'>
                                        <p className='text-xs font-medium text-neutral-900'>Start Date :</p>
                                        <p className='text-xs font-medium text-neutral-900 mx-2'>{format(new Date(trip.starttime), 'LLL dd, y')}</p>
                                    </div>

                                    <div className='flex mt-1'>
                                        <p className='text-xs font-medium text-neutral-900'>End Date :</p>
                                        <p className='text-xs font-medium text-neutral-900 mx-2'>{format(new Date(trip.endtime), 'LLL dd, y')}</p>
                                    </div>

                                    <div className='flex mt-1'>
                                        <p className='text-xs font-medium text-neutral-900'>Pickup:</p>
                                        <p className='text-xs font-medium text-neutral-900 mx-2'>{trip.vehaddress1}</p>
                                    </div>

                                    <div className='flex'>
                                        <span className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:text-red-300 ${trip.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900' : trip.status === 'Requested' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900' : trip.status === 'Started' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900' : 'bg-red-100 text-red-800 dark:bg-red-900'}`}>{trip.status}</span>

                                        {trip.swapDetails && trip.swapDetails.length > 0 && (
                                            <div>
                                                {trip.swapDetails[0].statuscode.toLowerCase() === 'swappr' && <span className='mx-4 inline-flex items-center rounded-md bg-yellow-50 px-1 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20'> Swap Praposal Requested</span>}

                                                {trip.swapDetails[0].statuscode.toLowerCase() === 'swaprej' && <span className='mx-4 inline-flex items-center rounded-md bg-red-50 px-1 py-1 text-xs font-medium text-red-800 ring-1 ring-inset ring-red-600/20'> Swap Praposal Requested</span>}

                                                {trip.swapDetails[0].statuscode.toLowerCase() === 'swapacc' && <span className='mx-4 inline-flex items-center rounded-md bg-green-50 px-1 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20'> Swap Praposal Approved</span>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Add more details as needed */}
                                </div>
                            </div>
                            {/* <Button className='mt-4 mx-4 ' variant="outline">See Details</Button> */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TripsList;
