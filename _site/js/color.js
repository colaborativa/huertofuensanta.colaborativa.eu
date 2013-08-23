/*
Colors JS Library v1.1
Copyright 2012 Matthew B. Jordan
Licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License. (http://creativecommons.org/licenses/by-sa/3.0/)
http://matthewbjordan.me/colors
*/

;(function(){

  function none(obj){
    return (obj === null || obj === undefined);
  }

  var Color = function (a,b,c,d) {
    this.init(a,b,c,d);
  };

  Color.prototype.init = function(a,b,c){
    /*
      We can pass either an rgb, hex or hsl value here.
    */
    this.r = null, this.g= null, this.b = null, this.h = null, this.s = null, this.l = null;
    if ($.isArray(a)){
      c = a[2];
      b = a[1];
      a = a[0];
    }
    var obj;
    if (!none(a) && !none(b) && !none(c)){
      // It's an hsl or rgb.
      if ( a <=1 && b <=1 && c <= 1){
        // hsl
        obj = Colors.hslToRgb(a, b, c);
        this.r = obj.r, this.g = obj.g, this.b = obj.b;
      } else {
        this.r = a, this.g = b, this.b = c;
      }
    } else if (!none(a)){
      // hex value;
      obj = Colors.hexToRgb(a);
      this.r = obj.r, this.g = obj.g, this.b = obj.b;
    } else {
      console.warn('Invalid input in Colors', a, b ,c);
    }

    obj = Colors.rgbToHsl(this.r, this.g, this.b);
    this.h = obj.h, this.s = obj.s, this.l = obj.l;

    this.hex = Colors.rgbToHex(this.r, this.g, this.b);
  };

  Color.prototype.set = function(key, value){
    /*
      Safe set, so we recalculate all the values.
    */
    var obj;
    if (['h', 's', 'l'].indexOf(key) >= 0){
      this[key] = value;
      obj = Colors.hslToRgb(this.h, this.s, this.l);
      this.r = obj.r, this.g = obj.g, this.b = obj.b;
      this.hex = Colors.rgbToHex(this.r, this.g, this.b);
    } else if (['r', 'g', 'b'].indexOf(key) >= 0){
      this[key] = value;
      obj = Colors.rgbToHsl(this.r, this.g, this.b);
      this.h = obj.h, this.s = obj.s, this.l = obj.l;
      this.hex = Colors.rgbToHex(this.r, this.g, this.b);
    } else {
      console.warn('Invalid input in Colors', key, value);
    }
  };

  window.Color = Color;


  window.Colors = {

    clone: function(obj) {
        // Handle the 3 simple types, and null or undefined
        if (null === obj || "object" !== typeof obj){
          return obj;
        }
        var copy;
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    },

    obj: function(a,b,c, t){
      if ( b === undefined && c === undefined){
        return a;
      }

      var obj = {};
      obj[t[0]] = a;
      obj[t[1]] = b;
      obj[t[2]] = c;
      return obj;
    },

    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and l in the set [0, 1].
     *
     * @param   Number  r       The red color value
     * @param   Number  g       The green color value
     * @param   Number  b       The blue color value
     * @return  Array           The HSL representation
     */
    rgbToHsl: function (r, g, b){
      var obj = this.obj(r,g,b, 'rgb');

      r = obj.r / 255, g = obj.g / 255, b = obj.b / 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if(max == min){
          h = s = 0; // achromatic
      }else{
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max){
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }

      return this.obj(h, s, l, 'hsl');
    },

    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    hslToRgb: function (h, s, l){
      var obj = this.obj(h, s, l, 'hsl');
      h = obj.h, s = obj.s, l = obj.l;

      var r, g, b;

      if(s === 0){
          r = g = b = l; // achromatic
      }else{
          var hue2rgb = function(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          };

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      return this.obj(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 'rgb');
    },

    /**
     * Converts an RGB color value to HSV. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and v in the set [0, 1].
     *
     * @param   Number  r       The red color value
     * @param   Number  g       The green color value
     * @param   Number  b       The blue color value
     * @return  Array           The HSV representation
     */
    rgbToHsv: function (r, g, b){
        r = r/255, g = g/255, b = b/255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max === 0 ? 0 : d / max;

        if(max == min){
            h = 0; // achromatic
        }else{
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, v];
    },

    /**
     * Converts an HSV color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes h, s, and v are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  v       The value
     * @return  Array           The RGB representation
     */
    hsvToRgb: function (h, s, v){
        var r, g, b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch(i % 6){
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return [r * 255, g * 255, b * 255];
    },
    rgbToHex: function (r, g, b) {
      var obj = this.obj(r, g, b, 'rgb');
      return "#" + ((1 << 24) + (obj.r << 16) + (obj.g << 8) + obj.b).toString(16).slice(1);
    },
    hexToRgb: function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    complement: function(r, g, b){
      var obj = this.obj(r, g, b, 'rgb');
      obj.r = 255-obj.r;
      obj.g = 255-obj.g;
      obj.b = 255-obj.b;
      return obj;
    },
    angle: function(v, diff){
      return (v + diff) > 1 ? (v + diff) - 1: v+diff;
    },
    angles: function(v, diff, count){
      var results = [];
      for(var i=0; i < count; i++){
        results.push(v);
        v = this.angle(v, diff);
      }
      return results;
    },
    palette: function(r, g, b, num, sat, light){
      var hsl = this.rgbToHsl(this.obj(r, g, b, 'rgb'));
      results = [];
      angles = this.angles(hsl.h, 1/num, num);
      for(var i=0; i < angles.length; i++){
        var s = sat ? hsl.s * sat: hsl.s;
        var l = light ? hsl.l * light: hsl.l;
        results.push(this.hslToRgb(angles[i], s, l));
      }
      return results;
    },
    triadic: function(r, g, b, sat, light){
      return this.palette(r, g, b, 3, sat, light);
    },
    tetradic: function(r, g, b, sat, light){
      return this.palette(r, g, b, 4, sat, light);
    },
    pentadic: function(r, g, b, sat, light){
      return this.palette(r, g, b, 5, sat, light);
    },
    hexadic: function(r, g, b, sat, light){
      return this.palette(r, g, b, 6, sat, light);
    },

    /*
    * We want to find the lighest, darkest and most colorful colors
    * in a list.
    */
    segment: function(colors){
      var hsls = [];
      for(var i=0; i < colors.length; i++){
        var color = colors[i];
        hsls.push(this.rgbToHsl(color[0], color[1], color[2]));
      }
      hsls.sort(function(a, b) {
          return a.l - b.l;
      });

      var obj = {};

      obj.lightest = this.hslToRgb(hsls[hsls.length-1]);
      obj.darkest = this.hslToRgb(hsls[0]);

      hsls.sort(function(a, b) {
        return (a.l * a.s) - (b.l * b.s);
      });

      obj.colorful = this.hslToRgb(hsls[hsls.length-1]);

      return obj;
    },
    contrast: function (colors){
      var values = this.clone(colors);

      // RGB values sorted by weight.
      rgbs = values.splice(1);
      dominate = new Color(values[0]);

      // We can just order them by contrast, the highest is the text, the next is the header.
      h = rgbs.map(function(c){
       return new Color(c);
      }).sort(function(a,b){
       var j = Math.abs(dominate.l - b.l) - Math.abs(dominate.l - a.l);
       return j;
      });

      return h;
    }
};
})();




