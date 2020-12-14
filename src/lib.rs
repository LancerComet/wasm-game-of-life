mod utils;

use wasm_bindgen::prelude::*;
use std::fmt;
use js_sys;
use web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
  Dead = 0,
  Alive = 1
}

impl Cell {
  fn toggle (&mut self) {
    *self = match *self {
      Cell::Dead => Cell::Alive,
      Cell::Alive => Cell::Dead
    };
  }
}

#[wasm_bindgen]
pub struct Universe {
  width: u32,
  height: u32,
  cells: Vec<Cell>
}

impl Universe {
  fn get_index (&self, row: u32, column: u32) -> usize {
    return (row * self.width + column) as usize;
  }

  fn live_neighbor_count (&self, row: u32, column: u32) -> u8 {
    let mut count = 0;
    for delta_row in [self.height - 1, 0, 1].iter().cloned() {
      for delta_col in [self.width - 1, 0, 1].iter().cloned() {
        if delta_col == 0 && delta_row == 0 {
          continue;
        }

        let neighbor_row = (row + delta_row) % self.height;
        let neighbor_col = (column + delta_col) % self.width;
        let index = self.get_index(neighbor_row, neighbor_col);
        count += self.cells[index] as u8;
      }
    }

    return count;
  }

  fn make_all_cells_dead (&mut self) {
    self.cells = (0..self.width * self.height)
      .map(|_| Cell::Dead)
      .collect();
  }
}

// For unit test.
impl Universe {
  pub fn get_cells (&self) -> &[Cell] {
    return &self.cells;
  }

  pub fn set_cells_alive (&mut self, cells: &[(u32, u32)]) {
    for (row, column) in cells.iter().cloned() {
      let index = self.get_index(row, column);
      self.cells[index] = Cell::Alive;
    }
  }
}

#[wasm_bindgen]
impl Universe {
  pub fn width (&self) -> u32 {
    return self.width;
  }

  pub fn height (&self) -> u32 {
    return self.height;
  }

  pub fn get_cells_ptr (&self) -> *const Cell {
    return self.cells.as_ptr();
  }

  pub fn tick (&mut self) {
    let mut cells_next_state = self.cells.clone();

    for row in 0..self.height {
      for column in 0..self.width {
        let index = self.get_index(row, column);
        let cell = self.cells[index];
        let live_neighbors = self.live_neighbor_count(row, column);

        // log!(
        //   "cell[{}, {}] is initially {:?} and has {} live neighbors",
        //   row, column, cell, live_neighbors
        // );

        let cell_next_state = match (cell, live_neighbors) {
          (Cell::Alive, x) if x < 2 => Cell::Dead,
          (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
          (Cell::Alive, x) if x > 3 => Cell::Dead,
          (Cell::Dead, 3) => Cell::Alive,
          (otherwise, _) => otherwise,
        };

        // log!("    it becomes {:?}", cell_next_state);

        cells_next_state[index] = cell_next_state;
      }
    }

    self.cells = cells_next_state;
  }

  pub fn render (&self) -> String {
    return self.to_string();
  }

  pub fn set_width (&mut self, width: u32) {
    self.width = width;
    self.make_all_cells_dead();
  }

  pub fn set_height (&mut self, height: u32) {
    self.height = height;
    self.make_all_cells_dead();
  }

  pub fn toggle_cell (&mut self, row: u32, column: u32) {
    let index = self.get_index(row, column);
    self.cells[index].toggle();
  }

  pub fn new (width: u32, height: u32) -> Universe {
    utils::set_panic_hook();
    let cells = (0..width * height)
        .map(|_| {
          match js_sys::Math::random() {
            r if r < 0.5 => Cell::Alive,
            _ => Cell::Dead
          }
        })
        .collect();

    return Universe {
      width,
      height,
      cells
    }
  }
}

impl fmt::Display for Universe {
  fn fmt (&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    for line in self.cells.as_slice().chunks(self.width as usize) {
      for &cell in line {
        let symbol = if cell == Cell::Dead {
          '◻'
        } else {
          '◼'
        };
        write!(f, "{}", symbol)?;
      }
    }
    return Ok(());
  }
}
