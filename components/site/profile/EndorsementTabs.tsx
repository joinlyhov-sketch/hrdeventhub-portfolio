
export default function EndorsementTabs() {
    const endorsements = [
        {name: 'Path Nimol', 
            generation: '13th', 
            tag: 'Homecoming', 
            text: "I've met this student in Homecoming event. She is very friendly and we dicussed a lot about her basiccourse journey and plan after graduation. I really recommend this kind of person.",
            image: '/images/nimol.png'
        },
        {
            name: 'Hort Soknika', 
            generation: '14th', 
            tag:  'Khmer New Year', 
            text: "I've met this student in homecoming event. She is very friendly and we discussed a lot about her basic course journey and plan after graduation. I really recommend this kind of person.",
            image: '/images/nika.png'
        },
        {name: 'Hiem Sreynit',
             generation: '14th', 
             tag: 'Monthly Party', 
             text: "I've met this student in Montly Party. She is very friendly and we discussed a lot about her basic course journey and plan after graduation. I really recommend this kind of person.",
             image: '/images/sreynit.png'},
        {name: 'Souy Sovichea', 
            generation: '14th', 
            tag: 'Closing Day', 
            text: "I've met this student in Closing Day. She is very friendly and we discussed a lot about her basic course journey and plan after graduation. I really recommend this kind of person.",
            image: '/images/vichea.png'},
     ]
  return (
    <div className='space-y-6'>
        {endorsements.map((endorsement, index)  => (
            <div key= {index} className='pb-6 border-b border-border last:border-0 last:pb-0'>
               <div className='flex justify-between items-start mb-3 gap-4'>
            <div className='flex gap-3 items-center'>
              <div className='w-10 h-10 rounded-full bg-grey-100 border border-border flex items-center justify-center shrink-0 overflow-hidden relative'>
                {endorsement.image ? (
                  <img 
                    src={endorsement.image} 
                    alt={endorsement.name} 
                    className='w-full h-full object-cover relative z-10' 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
              </div>
                <div>
                    <p className='type-detail-small-medium text-muted-foreground'>{endorsement.generation} Generation</p>
                    <p className='type-desc-semibold text-primary'>{endorsement.name}</p>
                </div>
                </div>
                    <span className='bg-primary text-grey-100 px-3 py-1 rounded-full type-detail-small-medium'>
                        {endorsement.tag}

                    </span>
                    </div>
                    <p className='type-detail text-grey-500'>
                        "{endorsement.text}"
                    </p>
            </div>
        ))}
        </div>
  );
}

    