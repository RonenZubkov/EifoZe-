import { Component, Directive,OnInit,Output, EventEmitter} from '@angular/core';
import {ToggleButton} from '../directives/toggle-button';
import {GoogleMapsAPIWrapper ,MapsAPILoader, NoOpMapsAPILoader, MouseEvent, GOOGLE_MAPS_PROVIDERS, GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {SymFilterPipe} from '../pipes/filter-list.pipe';
import {LayerService} from '../../layer/layer.service';
import {LayerModel} from "../../layer/layer.model";

interface marker {
    lat: number;
    lng: number;
    label?: string;
    shown?: boolean;
    icon?: string;
    sym?: string;
    // latHome: any;
    // lngHome: any;
}


@Component({
    moduleId: module.id,
    selector: 'map',
    directives: [GOOGLE_MAPS_DIRECTIVES,ToggleButton],
    providers: [GoogleMapsAPIWrapper],
    pipes: [SymFilterPipe],
    // providers: [ANGULAR2_GOOGLE_MAPS_PROVIDERS,layers],
    // providers: [LayerService],
    styles: [`
    .sebm-google-map-container {
       margin-top: 25%;
       height: 83% ;
     }
  `],

    template: `
    <sebm-google-map 
      [latitude]="lat"
      [longitude]="lng"
      [zoom]="zoom"
      [disableDefaultUI]="false"
      [zoomControl]="false"
      (mapClick)="mapClicked($event)
        ">
      <sebm-google-map-marker 
          *ngFor="let m of markers | markPipe; let i = index"
          (markerClick)="clickedMarker(m.label, i)"
          [latitude]="m.lat"
          [longitude]="m.lng"
          [label]="m.label"
          [markerDraggable]="m.draggable"
          (dragEnd)="markerDragEnd(m, $event)
          ">
        <sebm-google-map-info-window>
          <strong>InfoWindow content</strong>
        </sebm-google-map-info-window>
      </sebm-google-map-marker>

    </sebm-google-map>
    <nav class="navbar navbar-default navbar-fixed-bottom">
        <a class="btn addLayer-btn" routerLink="/layer/edit">Add your own Layer</a>
    </nav>
    
     <!--<toggleButton [(on)]="state">Atm
        {{state ? 'On' : 'Off'}}
     </toggleButton>

     <toggleButton>Wc</toggleButton>-->

`
})

export class MapComponent implements OnInit {

    state: boolean = false;
    // google maps zoom level
    zoom: number = 8;

    // initial center position for the map
    lat: number = 32.087374;
    lng: number = 34.802799;

    private _layers : LayerModel[];
    @Output() private locAdded = new EventEmitter;


    constructor(private _wrapper: GoogleMapsAPIWrapper, private layerService: LayerService){
        // this._wrapper.getNativeMap().then((m) => {
        //     let options = { minZoom: 2, maxZoom: 15,
        //         disableDefaultUI: true,
        //         scrollwheel: true,
        //         draggable: false,
        //         disableDoubleClickZoom: false,
        //         panControl: false,
        //         scaleControl: false,
        //     }})
        }

    ngOnInit(){

        let check = this.layerService.query().then(layers =>{
            return this._layers = layers});
        console.log('check:',check);
        console.log('this._layers:', this._layers);

        if (navigator.geolocation) {
            console.log('navigator.geolocation:');
            navigator.geolocation.watchPosition(this.showPosition.bind(this), this.showError.bind(this));
            // this.showError);
        }




        // }
    }



    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`)
    }

    mapClicked($event: MouseEvent) {
        this.markers.push({
        lat: $event.coords.lat,
        lng: $event.coords.lng
        });
        
        console.log('$event.coords', $event.coords);
        
        this.locAdded.emit($event.coords);
    }

    markerDragEnd(m: marker, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
    }

    showPosition(pos){
        var crd = pos.coords;
        // this.latHome = crd.latitude;
        // this.lngHome = crd.longitude;

        console.warn('Your current position is:');
        // console.log('Latitude : ' + this.latHome);
        // console.log('Longitude: ' + this.lngHome);
        console.log('More or less ' + crd.accuracy + ' meters.');
    }

    showError(error){
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred");
                break;
        }
    }

    markers: marker[] = [
        {
            lat: 32.087289,
            lng: 34.803521,
            label: 'A',
            shown: true,
            sym: 'atm'
        },
        {
            lat: 32.087871,
            lng: 34.803089,
            label: 'B',
            shown: false,
            sym: 'atm'
        },
        {
            lat: 32.087516,
            lng: 34.802052,
            label: 'C',
            shown: true,
            sym: 'wc'
        }
    ]

}