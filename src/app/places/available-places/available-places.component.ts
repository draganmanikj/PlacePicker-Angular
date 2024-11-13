import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';


@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  error = signal('')
  isFetching = signal(true)

  constructor(
    private httpClient: HttpClient,
    private destroyRef: DestroyRef,
    private placesService: PlacesService
  ) { }

  ngOnInit() { 
    const subscription = this.placesService.loadAvailablePlaces().subscribe({
        next: (places) => { 
          this.places.set(places)
        },
        error: (error: Error) => { 
          this.error.set(error.message)
        },
        complete: () => { 
          this.isFetching.set(true)
        }
    });

    this.destroyRef.onDestroy(() => { 
      subscription.unsubscribe();
    }) 
  }

  onSelectPlace(selectedPlace: Place) { 
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace)
      .subscribe({
        next: (resData) => console.log(resData)
      });
    
      this.destroyRef.onDestroy(() => { 
        subscription.unsubscribe();
      }) 
  }
}
