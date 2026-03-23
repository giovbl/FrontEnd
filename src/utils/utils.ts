//Function for generating a displayable string based on the sample status
export function sampleStatusString(status:string): string {

    switch(status) {
        case 'unanalyzed':
            return 'Da analizzare'
        case 'analyzing':
            return 'In analisi'
        case 'completed':
            return 'Visualizza referto'
        default:
            return ''
    }
}

//Function for generating a displayable string based on the shipment status
export function shipmentString(status:string): string {

    switch(status) {
        case 'received':
            return 'In carico'
        case 'taken':
            return 'Preso'
        case 'in transit':
            return 'In transito'
        case 'arrived':
            return 'Arrivato'
        default:
            return ''
    }
}