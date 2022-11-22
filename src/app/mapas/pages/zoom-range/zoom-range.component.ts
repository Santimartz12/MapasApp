import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .no__select{
      user-select: none;
    }

    .center{
      text-align: center;
      margin-bottom: 0px; 
      margin-top: 5px; 
      }

    .row{
      background-color: white;
      border-radius: 10px;
      position: fixed;
      bottom: 50px;
      left: 50px;
      z-index: 999;
      width: 350px;
    }
    .mapa__container{
      width: 100%;
      height: 100%;
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild( 'mapa' ) divMapa!: ElementRef;


  mapa!: mapboxgl.Map;
  zoom: number = 16;
  centerMap: [number,number] = [-74.95166607757744, 5.123907237329673];

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // Esto es lo que va en el HTML
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerMap,
      zoom: this.zoom,
    });

    this.mapa.on('zoom', (ev) => {
      this.zoom  = this.mapa.getZoom();
    })

    this.mapa.on('zoomend', (ev) => {
      if(this.mapa.getZoom() > 18){
        this.mapa.zoomTo(18);
      }else if(this.mapa.getZoom() < 10){
        this.mapa.zoomTo(10);
      }
    })

    this.mapa.on('move', (ev) => {
      this.centerMap[0] = this.mapa.getCenter().lng;
      this.centerMap[1] = this.mapa.getCenter().lat;
    })

  }

  cambioZoom(value: string){
    this.mapa.zoomTo(Number(value)); 
  }

  zoomIn(){
    this.mapa.zoomIn();
  }

  zoomOut(){
    this.mapa.zoomOut();
  }

}