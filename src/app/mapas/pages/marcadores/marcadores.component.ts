import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorPlantilla {
  color: string;
  marcador?: mapboxgl.Marker;
  lngLat?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa__container{
      width: 100%;
      height: 100%;
    }

    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
    }
    li{
      cursor: pointer;
      user-select: none;
    }

    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild( 'mapa' ) divMapa!: ElementRef;

  marcadores: MarcadorPlantilla[] = [];

  mapa!: mapboxgl.Map;
  zoom: number = 15;
  centerMap: [number,number] = [-74.95166607757744, 5.123907237329673];

  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // Esto es lo que va en el HTML
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerMap,
      zoom: this.zoom,
    });

    this.cargarLocalStorage();

  }

  agregarMarcador(){

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const marker = new mapboxgl.Marker({
      draggable: true,
      color
    })
    .setLngLat(this.centerMap)
    .addTo(this.mapa)

    this.marcadores.push(
      {
        color,
        marcador: marker,
      }
    );

    this.guardarLocalStorage();

  }

  irMarcador( evento : MarcadorPlantilla ){

    this.mapa.flyTo({
      zoom: 16,
      center: [ evento.marcador!.getLngLat().lng , evento.marcador!.getLngLat().lat],
    })
  }

  guardarLocalStorage(){

    const lngLatArr: MarcadorPlantilla[] = [];

    this.marcadores.forEach(marcador => {
      const color = marcador.color;
      const {lng, lat} = marcador.marcador!.getLngLat();

      lngLatArr.push({
        color,
        lngLat: [lng,lat],
      })
    } )

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));

  }

  cargarLocalStorage(){

    if( !localStorage.getItem('marcadores')){
      return
    }

    const lnglatArr: MarcadorPlantilla[] = JSON.parse(localStorage.getItem('marcadores')!);

    lnglatArr.forEach( a => {
      const newMarker = new mapboxgl.Marker({
        color: a.color,
        draggable: true,
      }).setLngLat(a.lngLat!).addTo(this.mapa)

      this.marcadores.push({
        color: a.color,
        marcador: newMarker,
      })

      this.guardarLocalStorage();

      newMarker.on('dragend', ev => {
        this.guardarLocalStorage();
      })

    } )

  }

  eliminarMarcador(i: number){
    this.marcadores[i].marcador?.remove();
    this.marcadores.splice(i,1)
    this.guardarLocalStorage();
  }

}

