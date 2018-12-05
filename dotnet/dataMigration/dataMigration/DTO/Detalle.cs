using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class Detalle
    {
        public int IdDetalle { get; set; }
        public int IdNota { get; set; }
        public string Descripcion { get; set; }
        public decimal? Precio { get; set; }
    }
}
