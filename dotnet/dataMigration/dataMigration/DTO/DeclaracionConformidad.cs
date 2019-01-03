using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dataMigration.DTO
{
    class DeclaracionConformidad
    {
        public int IdDeclaracion { get; set; }
        public int IdTrabajo { get; set; }
        public DateTime? Fecha{ get; set; }
        public int? Meses { get; set; }
    }
}
