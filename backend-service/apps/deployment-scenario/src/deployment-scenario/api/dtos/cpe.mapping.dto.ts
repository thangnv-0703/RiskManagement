import { Expose } from 'class-transformer';

export class CpeMappingDto {
  @Expose()
  id: string = '';

  @Expose()
  part: string = '';

  @Expose()
  vendor: string = '';

  @Expose()
  product: string = '';

  @Expose()
  version: string = '';

  @Expose()
  update: string = '';

  @Expose()
  edition: string = '';

  constructor(cpeStr: string) {
    this.initCpe(cpeStr);
  }

  private initCpe(cpeStr: string): void {
    const attrs: string[] = [
      'part',
      'vendor',
      'product',
      'version',
      'update',
      'edition',
    ];
    let cpeParts: string[] = [];
    if (cpeStr) {
      cpeParts = cpeStr.replace('cpe:2.3:', '').split(':');
    }
    while (cpeParts.length > 0 && attrs.length > 0) {
      const next_attr = attrs.shift();
      this[next_attr] = cpeParts.shift()!;
    }
    this.id = cpeStr;
    this.vendor = this.get_human('vendor');
    this.product = this.get_human('product');
    this.version = this.get_human('version');
    this.update = this.get_human('update');
    this.edition = this.get_human('edition');
  }

  private get_human(attr: string): string {
    let val = this[attr];
    if (val) {
      val = val.replace('_', ' ');
    }

    const product_mapping: Record<string, string> = {
      ie: 'Internet Explorer',
    };
    if (attr === 'product' && val in product_mapping) {
      val = product_mapping[val];
    }

    if (/[a-z]/.test(val)) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }

    const uppercaseValues = ['SP0', 'SP1', 'SP2', 'SP3', 'SP4', 'SP5', 'SP6'];
    if (uppercaseValues.includes(val.toUpperCase())) {
      val = val.toUpperCase();
    }
    if (['x86', 'x64'].includes(val.toLowerCase())) {
      val = val.toLowerCase();
    }

    return val;
  }
}
