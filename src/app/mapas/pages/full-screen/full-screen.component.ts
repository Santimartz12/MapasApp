import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
    #mapa{
      width: 100%;
      height: 100%;
    }
    `
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    const map = new mapboxgl.Map({
      container: 'mapa', // Esto es lo que va en el HTML
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.95166607757744, 5.123907237329673],
      zoom: 18,
    });

  }

}