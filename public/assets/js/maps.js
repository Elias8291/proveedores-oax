let map;
let marker;
let geocoder;

function initMap() {
    const defaultCenter = { lat: 19.4326, lng: -99.1332 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: defaultCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        gestureHandling: "greedy",
        zoomControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.TERRAIN],
        },
        streetViewControl: false,
        fullscreenControl: false,
    });
    geocoder = new google.maps.Geocoder();
}

function placeMarker(location) {
    if (marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true,
        });
    }
}

function updateAddressFields(result) {
    const components = result.address_components;
    let streetNumber = "";
    let street = "";
    let settlement = "";
    let municipality = "";
    let state = "";
    let postalCode = "";

    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        const types = component.types;
        if (types.includes("street_number")) {
            streetNumber = component.long_name;
        } else if (types.includes("route")) {
            street = component.long_name;
        } else if (types.includes("sublocality_level_1") || types.includes("locality")) {
            settlement = component.long_name;
        } else if (types.includes("administrative_area_level_2")) {
            municipality = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
        } else if (types.includes("postal_code")) {
            postalCode = component.long_name;
        }
    }

    $("#codigo_postal").val(postalCode);
    $("#estado").val(state);
    $("#municipio").val(municipality);

    if (settlement) {
        let found = false;
        $("#colonia option").each(function () {
            if ($(this).text().includes(settlement)) {
                $(this).prop("selected", true);
                found = true;
                return false;
            }
        });
        if (!found && postalCode.length === 5) {
            $("#codigo_postal").trigger("input");
        }
    }

    $("#calle").val(street);
    $("#numero_exterior").val(streetNumber);
}

function searchAddress() {
    const postalCode = $("#codigo_postal").val();
    const state = $("#estado").val();
    const municipality = $("#municipio").val();
    const settlement = $("#colonia option:selected").text();
    const street = $("#calle").val();
    const streetNumber = $("#numero_exterior").val();

    let address = "";
    if (street) address += street + " ";
    if (streetNumber) address += streetNumber + ", ";
    if (settlement) address += settlement + ", ";
    if (municipality) address += municipality + ", ";
    if (state) address += state + ", ";
    if (postalCode) address += postalCode + ", ";
    address += "México";

    geocoder.geocode({ address: address }, function (results, status) {
        if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            placeMarker(results[0].geometry.location);
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}

$(document).ready(function () {
    window.initMap = initMap;

    $("#search-map-button").click(function (e) {
        e.preventDefault();
        searchAddress();
    });

    $("#codigo_postal").on("input", function () {
        var zipCode = $(this).val();
        $("#estado").val("");
        $("#municipio").val("");
        $("#colonia").html('<option value="">Seleccione un Asentamiento</option>');

        if (zipCode.length === 5) {
            $.ajax({
                url: "/settlements-by-zipcode",
                method: "GET",
                data: { zip_code: zipCode },
                success: function (data) {
                    if (data.length > 0) {
                        var firstSettlement = data[0];
                        $("#estado").val(firstSettlement.state);
                        $("#municipio").val(firstSettlement.municipality);
                        var coloniaSelect = $("#colonia");
                        coloniaSelect.empty();

                        if (data.length === 1) {
                            coloniaSelect.append($("<option>", {
                                value: firstSettlement.settlement_type + " " + firstSettlement.settlement_name,
                                text: firstSettlement.settlement_type + " " + firstSettlement.settlement_name,
                                selected: true,
                            }));
                        } else {
                            coloniaSelect.append($("<option>", { value: "", text: "Seleccione un Asentamiento" }));
                            for (var i = 0; i < data.length; i++) {
                                var settlement = data[i];
                                coloniaSelect.append($("<option>", {
                                    value: settlement.settlement_type + " " + settlement.settlement_name,
                                    text: settlement.settlement_type + " " + settlement.settlement_name,
                                }));
                            }
                        }
                    } else {
                        alert("No se encontraron resultados para este código postal");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error en la solicitud AJAX:", status, error, xhr.responseText);
                    alert("Error al buscar información: " + error);
                },
            });
        }
    });

    $("#colonia").on("change", function () {
        if ($("#codigo_postal").val().length === 5) {
            searchAddress();
        }
    });

    $("#calle").on("change", function () {
        if ($("#codigo_postal").val().length === 5) {
            searchAddress();
        }
    });

    $("#numero_exterior").on("change", function () {
        if ($("#codigo_postal").val().length === 5 && $("#calle").val()) {
            searchAddress();
        }
    });
});