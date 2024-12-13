import { TestBed } from '@angular/core/testing';

import { MessageSaleService } from './message-sale.service';

describe('MessageSaleService', () => {
  let service: MessageSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
