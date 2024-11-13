import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

import { Place } from '../place.model';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{

  error = signal('')
  isFetching = signal(true)
  places = this.placesService.loadedUserPlaces;

  constructor(
    private destroyRef: DestroyRef,
    private placesService: PlacesService
  ) { }

  ngOnInit() { 
    const subscription = this.placesService.loadUserPlaces()
      .subscribe({
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

  onRemovePlace(place: Place) { 
    const subscription = this.placesService.removeUserPlace(place).subscribe()

    this.destroyRef.onDestroy(() => { 
      subscription.unsubscribe();
    }) 
  }
}
