using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class TrabajoDetalle
    {
        public int IdTrabajoDetalle { get; set; }
        public int IdTrabajo { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
    }
}
