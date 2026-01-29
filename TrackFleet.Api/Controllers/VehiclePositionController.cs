using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrackFleet.Api.Services;

namespace TrackFleet.Api.Controllers
{
    [ApiController]
    [Route("api/vehicles/{vehicleId:guid}/position")]
    [Authorize]
    public class VehiclePositionController : ControllerBase
    {
        private readonly VehiclePositionSimulator _simulator;

        public VehiclePositionController(VehiclePositionSimulator simulator)
        {
            _simulator = simulator;
        }

        [HttpGet]
        public IActionResult GetCurrentPosition(Guid vehicleId)
        {
            var position = _simulator.GetNextPosition(vehicleId);

            return Ok(new
            {
                lat = position.Lat,
                lng = position.Lng,
                timestamp = position.Timestamp
            });
        }
    }
}
